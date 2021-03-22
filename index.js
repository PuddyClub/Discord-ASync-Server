// Prepare Module
const firebase = require('firebase');
const express = require('express');
const ON_DEATH = require('death');

// App
const app = { auth: { login: null }, web: {} };
const appModule = {

    // Express
    express: {

        // Cookie Session
        setCookieSession: function (result) { appModule.express.cookieSession = result; },
        cookieSession: {},

        // Create
        create: function () {

            // Modules
            const bodyParser = require('body-parser');
            const cookieSession = require('cookie-session');

            // Create Express App
            app.web.root = express();
            app.web.server = require('http').createServer(app.web.root);
            app.web.io = require('socket.io')(app.web.server);

            // Nunjucks
            const path = require('path');
            const nunjucks = require('nunjucks');
            nunjucks.configure(path.join(__dirname, '../views'), {
                autoescape: true,
                express: app.web.root
            });

            app.web.root.set('view engine', 'nunjucks');

            // Helmet
            const helmet = require('helmet');
            app.web.root.use(helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: [
                            "'self'",
                            "'unsafe-inline'",
                            'https://securetoken.googleapis.com/',
                            'https://www.googleapis.com/',
                            'https://discord.com/',
                            'wss://*.firebaseio.com/',
                            'https://*.firebaseio.com/',
                            'https://*.typekit.net/',
                        ],
                        imgSrc: [
                            "'self' data:",
                            'https://cdn.discordapp.com/',
                            'https://discord.com/'
                        ]
                    }
                }
            }));

            // Cookie Session
            app.web.cookieSession = cookieSession(appModule.express.cookieSession);

            // Body Parser
            app.web.root.use(bodyParser.json());
            app.web.root.use(bodyParser.urlencoded({     // to support URL-encoded bodies
                extended: true
            }));

            // Complete
            return;

        },

        // Start Slash Command Listener
        slashCommandListener: function () {

        },

        // Start
        start: function (port, callback) {

            // Callback
            if (typeof callback === "function") { app.web.root.listen(port, callback); }

            // Nope
            else { app.web.root.listen(port); }

        }

    },

    // Firebase
    firebase: {

        // Set onAuthStateChanged
        onAuthStateChanged: function (callback) { app.auth.onAuthStateChanged = callback; },

        // Start
        start: function (cfg) {

            // Console Log
            console.log('Starting Firebase...');

            // Starting Firebase
            firebase.initializeApp(cfg);
            app.auth.root = firebase.auth();
            app.db = firebase.database();

            // Firebase AuthStateChanged
            app.auth.root.onAuthStateChanged((user) => {

                // Status Changed

                // Callback
                if (typeof app.auth.onAuthStateChanged === "function") { app.auth.onAuthStateChanged(user); } else {

                    // is User
                    if (user) {
                        console.log('Firebase Auth received User Data!');
                    }

                    // Nope
                    else {
                        console.log('Firebase Auth received a empty User Data!');
                    }

                }

            });

            // Complete
            console.log('Firebase Started!');
            return firebase;

        },

        // Login Firebase
        login: function (token) {
            return new Promise(async (resolve, reject) => {

                // Add Login Cache
                if (typeof token !== "undefined") { app.auth.login = token; }

                // Start Login
                const loginStart = function (token) {
                    return app.auth.root.signInWithCustomToken(token).then((userCredential) => {
                        resolve(userCredential);
                    }).catch((err) => {
                        reject(err);
                    });
                };

                // Is Function
                if (typeof app.auth.login === "function") {

                    // Try Token
                    try {
                        const tokenResult = await app.auth.login();
                        loginStart(tokenResult);
                    }

                    // Fail
                    catch (err) { reject(err); }

                }

                // Is String
                else if (typeof app.auth.login === "string") {
                    loginStart(app.auth.login);
                }

                // Nothing
                else { reject(new Error('Invalid Firebase Token Value in the login method!')); }

                // Complete
                return;

            });
        }

    }

};

module.exports = appModule;

// ON Death
ON_DEATH(async function (signal, err) {

    // Closing Message
    console.log(`Closing App: ${signal}`);
    if (err) { console.error(err); }

    // Close Firebase Connection
    try { await firebase.auth().signOut(); } catch (err) { console.error(err); }
    return;

});
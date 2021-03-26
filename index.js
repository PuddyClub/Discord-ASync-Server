// Prepare Module
const firebase = require('firebase');
const _ = require('lodash');
const expressTemplate = require('@tinypudding/firebase-express-template');
const middleware = require('./files/middleware');
const ON_DEATH = require('death');
let isDebug = false;
if (process.argv[2] === "test") { isDebug = true; }

// App
const app = { users: [], auth: { login: null }, web: {}, discord: { bots: [], module: require('discord.js') } };
const appModule = {

    // Express
    express: {

        // Cookie Session
        setCookieSession: function (result) { appModule.express.cookieSession = result; },
        cookieSession: {},

        // Create
        create: function (tinyCfg) {
            return new Promise((resolve, reject) => {

                // Create Settings
                tinyCfg = _.defaultsDeep({}, tinyCfg, {
                    
                    // Firebase Settings
                    firebase: {},
                    
                    // Cookie Session Settings
                    cookieSession: {
                        keys: []
                    },

                    // Discord Settings
                    discord: {
                        apps: {},
                        auth: {
                            client_id: "",
                            client_secret: ""
                        }
                    },

                    // Web Settings
                    web: {
                        slashCommandListener: {
                            enabled: true,
                            id: "",
                            token: ""
                        },
                        botChecker: false
                    },

                    // Other Settings
                    localhost: "localhost:3000",
                    domain: "",
                    crypto: ""

                });

                // Cookie Session
                const cookieSession = require('cookie-session');
                try {
                    appModule.express.cookieSession = cookieSession(appModule.express.cookieSession);
                } catch (err) { reject(err); }

                // Test Mode
                if (tinyCfg.testMode) { process.env.FUNCTIONS_EMULATOR = true; }

                // Discord Config
                tinyCfg.discord.auth.discordScope = ['identify', 'email'];
                tinyCfg.discord.auth.first_get_user = true;

                // Prepare App
                app.web.root = expressTemplate({

                    // Cookie Session
                    cookieSession: appModule.express.cookieSession,

                    // File Config
                    fileCfg: { fileMaxAge: '2592000000' },

                    // Error Page
                    errorPage: require('./files/errorPage'),

                    // Website Middleware
                    middleware: (web) => { return middleware(resolve, reject, tinyCfg.discord, tinyCfg.web, web, app); },

                    // config.json
                    cfg: { domain: tinyCfg.domain },

                    // Helmet
                    // https://www.npmjs.com/package/helmet
                    helmet: {
                        contentSecurityPolicy: {
                            directives: {
                                defaultSrc: [
                                    "'self'",
                                    "'unsafe-inline'",
                                    'https://discord.com/',
                                    'https://*.cloudflare.com/',
                                    'https://*.typekit.net/'
                                ],
                                imgSrc: [
                                    "'self' data:",
                                    'https://cdn.discordapp.com/',
                                    'https://discord.com/',
                                    'https://*.cloudflare.com/',
                                    'https://*.typekit.net/'
                                ]
                            }
                        }
                    },

                    // Main
                    main: {

                        // Invalid Domain
                        invalidDomainCallback: function (req, res, next) {

                            // Invalid Domain
                            if (!isDebug) {
                                const error_page = require('@tinypudding/puddy-lib/http/HTTP-1.0');
                                console.error(new Error('Invalid Domain! ' + req.firebase_web_session.domain));
                                return error_page.send(res, 403);
                            }

                            // Debug
                            else { return next(); }

                        },

                        // Validator
                        domainValidator: {

                            // Domain Validator
                            domain: tinyCfg.domain,

                            // Static Path Protector
                            staticPath: ['/css/', '/img/', '/js/', '/sound/', '/webfonts/']

                        }

                    },

                    // csrftoken
                    csrftoken: {

                        // This is the path of the module method ( csrftoken(csrfToken', 1, 'hours'); )
                        module: ['csrfToken', 1, 'hours'],

                        // The Callback of the Csrf Token validator for all other modules of the template.
                        callback: function (req) { return { now: req.body.csrftoken, server: req.csrftoken.now.value }; }

                    },

                    // Timezone Module
                    timezone: {
                        urls: { setTime: '/setTime' },
                        clock24: true,
                        autoList: true,
                        setSecondary: true,
                        fileMaxAge: '2592000000'
                    },

                    // i18 Module 
                    i18: {

                        // Vars Session Names.
                        cfg: {

                            // Vars cookie-session.
                            varsSession: {
                                sessionLang: 'sessionLang',
                                userLang: 'userLang',
                                nowLang: 'nowLang',
                                langIsUser: 'langIsUser'
                            },

                            // Lang List.
                            list: [
                                { value: 'en', name: 'English' },
                                { value: 'pt-br', name: 'Português Brasil' }
                            ]

                        },

                        // URLs of the module.
                        urls: {
                            setLang: '/setLang'
                        },

                    },

                    // Discord
                    discordOAuth2: {

                        // Localhost to test
                        localhost: tinyCfg.localhost,

                        // Base
                        discord: {

                            // Discord URL
                            url: {
                                commandLogin: '/commandLogin',
                                botLogin: '/botLogin',
                                login: '/login',
                                logout: '/logout',
                                redirect: '/redirect'
                            },

                            // Auth. If you don't set any database values to get the values automatically, the values written here will be used. You must at least enter the discordScope. 
                            auth: tinyCfg.discord.auth,

                            // Crypto Key
                            crypto: tinyCfg.crypto,

                            // Configuration
                            cfg: { needEmailVerified: true }

                        }

                    }

                });

                // Complete
                return;

            });
        },

        // Start
        start: function (port, callback) {

            // Callback
            if (typeof callback === "function") { app.web.server.listen(port, callback); }

            // Nope
            else { app.web.server.listen(port); }

        }

    },

    // Add Bots
    addBot: function (token, cfg = {}) {
        const bot = new app.discord.module.Client(cfg);
        app.discord.bots.push({ bot: bot, token: token });
        return bot;
    },

    // Add User
    addUser: function (userID, permLevel) {

        // Add User
        if ((typeof userID === "string" || typeof userID === "number") && typeof permLevel === "number") {

            // Exist Value
            const index = app.users.findIndex(user => user.id === userID);

            // Add User
            if (index < 0) {
                app.users.push({ id: userID, permLevel: permLevel });
            }

            // Edit User
            else { app.users[index].permLevel = permLevel; }

            // Complete
            return true;

        }

        // Fail
        else { return false; }

    },

    // Remove User
    removeUser: function (userID) {

        // Get Value
        const index = app.users.findIndex(user => user.id === userID);

        // Exist User
        if (index > -1) { app.users.splice(index, 1); return true; }

        // Nope
        else { return false; }

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
            app.firebase = firebase;
            app.auth.root = firebase.auth();

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
// Prepare Module
const firebase = require('firebase');
const expressTemplate = require('@tinypudding/firebase-express-template');
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
        create: function (tinyCfg) {
            return new Promise((resolve) => {

                const cookieSession = require('cookie-session');
                appModule.express.cookieSession = cookieSession(appModule.express.cookieSession);

                // Prepare App
                app.web.root = expressTemplate({

                    // Cookie Session
                    cookieSession: appModule.express.cookieSession,

                    // File Config
                    fileCfg: {
                        fileMaxAge: '2592000000'
                    },

                    // Error Page
                    errorPage: (req, res, data, cfg, firebaseWeb) => {

                        // Is a Error Page
                        if (res && req) {

                            // Prepare Result
                            const result = { code: data.code };

                            // Get Error Message
                            if (data.message) { result.text = data.message; }
                            else if (data.err && data.err.message) { result.text = data.err.message; }
                            else { result.text = '???'; }

                            // Log
                            if (data.code !== 404) {
                                let errorData = null;
                                if (data.err) { errorData = data.err; }
                                else if (data.message) { errorData = new Error(data.message); }
                                else { errorData = new Error('Unknown Error'); }
                                errorData.code = data.code;
                                console.error(errorData);
                            }

                            // Send Error Page
                            return res.json(result);

                        }

                        // Nothing
                        else { return; }

                    },

                    // Website Middleware
                    middleware: function (web) {

                        // Nunjucks
                        const path = require('path');
                        const nunjucks = require('nunjucks');
                        nunjucks.configure(path.join(__dirname, '../views'), {
                            autoescape: true,
                            express: web.app
                        });

                        web.app.set('view engine', 'nunjucks');

                        // Modules
                        const bodyParser = require('body-parser');

                        // Create Express App
                        app.web.server = require('http').createServer(web.app);

                        // Body Parser
                        web.app.use(bodyParser.json());
                        web.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
                            extended: true
                        }));

                        // Homepage
                        web.app.get('/', web.dsSession(), (req, res) => {
                            res.render('test');
                            return;
                        });

                        // Complete
                        web.fn();
                        resolve(web);

                    },

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
                                    'https://discord.com/'
                                ],
                                imgSrc: [
                                    "'self' data:",
                                    'https://cdn.discordapp.com/',
                                    'https://discord.com/'
                                ]
                            }
                        }
                    },

                    // Main
                    main: {
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
                            auth: {
                                client_id: '',
                                client_secret: '',
                                discordScope: ['identify', 'email'],
                                first_get_user: true
                            },

                            // Crypto Key
                            crypto: { key: 'tinypudding123456789012345678900' },

                            // Configuration
                            cfg: { needEmailVerified: true }

                        }

                    }

                });

                // Complete
                return;

            });
        },

        // Start Slash Command Listener
        slashCommandListener: function () {

            // Complete
            return;

        },

        // Start Slash Command Listener
        botChecker: function () {

            // Start Socket IO
            app.web.io = require('socket.io')(app.web.server);

            // Complete
            return;

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
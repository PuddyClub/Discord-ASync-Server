module.exports = function (app, index) {
    return new Promise(async (resolve, reject) => {

        // Get Values
        const bot = app.discord.bots[index].bot;
        const firebaseBaseCfg = app.firebaseCfg;
        const firebase = app.firebase;
        const login = app.auth.login;

        // Log
        console.log('Preparing Firebase Bot Cache... (Index ' + index + ')');

        // Modules
        const objType = require('@tinypudding/puddy-lib/get/objType');
        const _ = require('lodash');
        const clone = require('clone');

        // Prepare Config
        if (!app.discord.bots[index].fbCfg) { app.discord.bots[index].fbCfg = {}; }
        
        // Firebase Setting
        if(typeof app.discord.bots[index].fbCfg.databaseURL !== "string") {app.discord.bots[index].fbCfg.databaseURL = '';}
        if(typeof app.discord.bots[index].fbCfg.path !== "string") {app.discord.bots[index].fbCfg.path = null;}
        if(typeof app.discord.bots[index].fbCfg.id !== "string") {app.discord.bots[index].fbCfg.id = null;}
        if(typeof app.discord.bots[index].fbCfg.allEvents !== "boolean") {app.discord.bots[index].fbCfg.allEvents = false;}
        
        // Message Cache
        app.discord.bots[index].fbCfg.messageCache =  _.defaultsDeep({}, app.discord.bots[index].fbCfg.messageCache, {
            maxSize: 200,
            lifeTime: 0,
            sweepInterval: 0,
            editHistoryMaxSize: -1
        });
        
        // Events
        app.discord.bots[index].fbCfg.events =  _.defaultsDeep({}, app.discord.bots[index].fbCfg.events, {
            channelCreate: false,
                channelDelete: false,
                channelPinsUpdate: false,
                channelUpdate: false,
                debug: false,
                emojiCreate: false,
                emojiDelete: false,
                emojiUpdate: false,
                error: false,
                guildBanAdd: false,
                guildBanRemove: false,
                guildCreate: false,
                guildDelete: false,
                guildIntegrationsUpdate: false,
                guildMemberAdd: false,
                guildMemberAvailable: false,
                guildMemberRemove: false,
                guildMembersChunk: false,
                guildMemberSpeaking: false,
                guildMemberUpdate: false,
                guildUnavailable: false,
                guildUpdate: false,
                invalidated: false,
                inviteCreate: false,
                inviteDelete: false,
                message: false,
                messageDelete: false,
                messageDeleteBulk: false,
                messageReactionAdd: false,
                messageReactionRemove: false,
                messageReactionRemoveAll: false,
                messageReactionRemoveEmoji: false,
                messageUpdate: false,
                presenceUpdate: false,
                rateLimit: false,
                ready: false,
                roleCreate: false,
                roleDelete: false,
                roleUpdate: false,
                shardDisconnect: false,
                shardError: false,
                shardReady: false,
                shardReconnecting: false,
                shardResume: false,
                typingStart: false,
                userUpdate: false,
                voiceStateUpdate: false,
                warn: false,
                webhookUpdate: false
        });

        // Config Value
        const fbCfg = app.discord.bots[index].fbCfg;

        // Is Object
        if (
            objType(firebase, 'object') &&
            objType(firebaseBaseCfg, 'object') &&
            objType(fbCfg, 'object') &&
            typeof fbCfg.databaseURL === "string" &&
            typeof fbCfg.id === "string" &&
            fbCfg.id.length > 0 &&
            fbCfg.databaseURL.length > 0
        ) {

            // Start Firebase
            try {

                // Config Firebase
                const firebaseCfg = clone(firebaseBaseCfg);
                firebaseCfg.databaseURL = fbCfg.databaseURL;

                // Create Firebase App
                fbCfg.app = { root: firebase.initializeApp(firebaseCfg, fbCfg.id) };
                fbCfg.app.db = { root: fbCfg.app.root.database() };

                // Start DB
                if (typeof fbCfg.path !== "string" || fbCfg.path === '') {
                    fbCfg.app.db.main = fbCfg.app.db.root.ref('/');
                } else {
                    fbCfg.app.db.main = fbCfg.app.db.root.ref(fbCfg.path);
                }

                // Prepare Auth
                fbCfg.app.auth = fbCfg.app.root.auth();

                // Firebase AuthStateChanged
                let firstTiemAuthState = true;
                fbCfg.app.auth.onAuthStateChanged((user) => {

                    // Update User
                    fbCfg.user = user;

                    // is User
                    if (user) {
                        console.log('Firebase Auth from Discord Bot received User Data! (Index ' + index + ')');
                        if (firstTiemAuthState) {

                            // Disable
                            firstTiemAuthState = false;

                            // Result
                            fbCfg.bot = bot;
                            require('./discord')(bot, fbCfg, index);
                            console.log('Firebase Bot Cache started! (Index ' + index + ')');
                            resolve();

                        }
                    }

                    // Nope
                    else {
                        console.log('Firebase Auth from Discord Bot received a empty User Data! (Index ' + index + ')');
                    }

                });

                // Start Login
                const loginStart = function (token) {
                    return fbCfg.app.auth.signInWithCustomToken(token).then((userCredential) => {
                        fbCfg.userCredential = userCredential;
                        return;
                    }).catch((err) => {
                        reject(err);
                        return;
                    });
                };

                // Is Function
                if (typeof login === "function") {

                    // Try Token
                    try {
                        const tokenResult = await login();
                        loginStart(tokenResult);
                    }

                    // Fail
                    catch (err) { reject(err); }

                }

                // Is String
                else if (typeof login === "string") {
                    loginStart(login);
                }

                // Nothing
                else { reject(new Error('Invalid Firebase Token Value from Discord Bot in the login method! (Index ' + index + ')')); }

            }

            // Fail
            catch (err) {

                // Error Message
                console.error(err);
                fbCfg.app = null;

            }

        }

        // Nope
        else { console.log('Firebase Bot Cache disabled! (Index ' + index + ')'); resolve(); }

        // Complete
        return;

    });
};
module.exports = function (bot, index, fbCfg, firebaseBaseCfg, firebase) {
    return new Promise((resolve, reject) => {

        // Log
        console.log('Preparing Firebase Bot Cache... (Index ' + index + ')');

        // Modules
        const objType = require('@tinypudding/puddy-lib/get/objType');
        const _ = require('lodash');
        const clone = require('clone');

        // Prepare Config
        fbCfg = _.defaultsDeep({}, fbCfg, {

            // Database
            database: { name: '', path: null },

            // Message Cache
            messageCache: {
                maxSize: 200,
                lifeTime: 0,
                sweepInterval: 0,
                editHistoryMaxSize: -1
            },

            // Events
            events: {
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
            }

        });

        // Is Object
        if (
            objType(firebase, 'object') &&
            objType(firebaseBaseCfg, 'object') &&
            objType(fbCfg, 'object') &&
            objType(fbCfg.database, 'object') &&
            typeof fbCfg.database.databaseURL === "string" &&
            typeof fbCfg.database.id === "string" &&
            fbCfg.database.databaseURL.length > 0
        ) {

            // Start Firebase
            let canStartFirebase;
            try {

                // Config Firebase
                const firebaseCfg = clone(firebaseBaseCfg);
                firebaseCfg.databaseURL = fbCfg.database.databaseURL;

                // Create Firebase App
                bot.firebase = { root: firebase.initializeApp(firebaseCfg, fbCfg.database.id) };
                bot.firebase.db = { root: bot.firebase.root.database() };

                // Start DB
                if (typeof fbCfg.database.path !== "string" || fbCfg.database.path === '') {
                    bot.firebase.db.main = bot.firebase.db.root.ref('/');
                } else {
                    bot.firebase.db.main = bot.firebase.db.root.ref(fbCfg.database.path);
                }

                // Allow
                canStartFirebase = true;

            }

            // Fail
            catch (err) {

                // Error Message
                console.error(err);
                bot.firebase = null;
                canStartFirebase = false;

            }

            // Start Firebase Bot Server
            if (canStartFirebase) {

                // Result
                require('./discord')(bot);
                console.log('Firebase Bot Cache started! (Index ' + index + ')');
                resolve();

            }

            // Nope
            else { console.log('Firebase Bot Cache disabled by error! (Index ' + index + ')'); resolve(); }

        }

        // Nope
        else { console.log('Firebase Bot Cache disabled! (Index ' + index + ')'); resolve(); }

        // Complete
        return;

    });
};
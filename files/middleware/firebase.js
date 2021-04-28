module.exports = function (bot, index, fbCfg, firebase) {
    return new Promise((resolve, reject) => {

        // Log
        console.log('Preparing Firebase Bot Cache... (Index ' + index + ')');

        // Modules
        const objType = require('@tinypudding/puddy-lib/get/objType');
        const _ = require('lodash');

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
        if (objType(fbCfg, 'object') && objType(fbCfg.database, 'object') && typeof fbCfg.database.name === "string" && fbCfg.database.name.length > 0) {

            // Test
            console.log(fbCfg);
            console.log(bot);
            console.log(firebase);

            // Result
            console.log('Bot Cache started! (Index ' + index + ')');
            resolve();

        }

        // Nope
        else { console.log('Bot Cache disabled! (Index ' + index + ')'); resolve(); }

        // Complete
        return;

    });
};
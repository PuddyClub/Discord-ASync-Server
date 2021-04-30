module.exports = function (bot, cfg, index) {

    // Prepare Event Server. 
    // This function will tell you whether the server is logged in the firebase or not.
    let firstTime = true;
    const firstEventAdded = require('@tinypudding/firebase-lib/database/presence');

    // Create Event
    const createEvent = (eventName) => {

        // Exist
        if (cfg.events[eventName] || cfg.allEvents) {

            // First Time
            if (firstTime) {

                // First Time Disabled
                firstTime = false;

                // Since I can connect from multiple devices or browser tabs, we store each connection instance separately
                // any time that connectionsRef's value is null (i.e. has no children) I am offline
                var myConnectionsRef = cfg.app.db.main.child('dsjs/connections');

                // stores the timestamp of my last disconnect (the last time I was seen online)
                var lastOnlineRef = cfg.app.db.main.child('dsjs/lastOnline');

                // Start Connection Database Warn
                firstEventAdded.start(cfg.app.db.root, myConnectionsRef, lastOnlineRef);

            }

            // Prepare
            let eventFunction;

            // Try Create
            try {
                eventFunction = require('./' + eventName);
            } catch (err) {
                console.error(err);
                eventFunction = null;
            }

            // Add Event
            if (typeof eventFunction === "function") {
                console.log(`The Firebase Event "${eventName}" was added in the bot index ${index}!`);
                bot.on(eventName, async function () {

                    // Execute Event
                    await eventFunction(arguments, {
                        escape: require('./generator/escapeResult'),
                        root: cfg.app.db.main,
                        event: cfg.app.db.main.child('events/' + eventName)
                    }, cfg, index);
                    return;

                });
            }

        }

        // Complete
        return;

    };

    // Event List
    createEvent('channelCreate');
    createEvent('channelDelete');
    createEvent('channelPinsUpdate');
    createEvent('channelUpdate');
    createEvent('debug');
    createEvent('emojiCreate');
    createEvent('emojiDelete');
    createEvent('emojiUpdate');
    createEvent('error');
    createEvent('guildBanAdd');
    createEvent('guildBanRemove');
    createEvent('guildCreate');
    createEvent('guildDelete');
    createEvent('guildIntegrationsUpdate');
    createEvent('guildMemberAdd');
    createEvent('guildMemberAvailable');
    createEvent('guildMemberRemove');
    createEvent('guildMembersChunk');
    createEvent('guildMemberSpeaking');
    createEvent('guildMemberUpdate');
    createEvent('guildUnavailable');
    createEvent('guildUpdate');
    createEvent('invalidated');
    createEvent('inviteCreate');
    createEvent('inviteDelete');
    createEvent('message');
    createEvent('messageDelete');
    createEvent('messageDeleteBulk');
    createEvent('messageReactionAdd');
    createEvent('messageReactionRemove');
    createEvent('messageReactionRemoveAll');
    createEvent('messageReactionRemoveEmoji');
    createEvent('messageUpdate');
    createEvent('presenceUpdate');
    createEvent('rateLimit');
    createEvent('ready');
    createEvent('roleCreate');
    createEvent('roleDelete');
    createEvent('roleUpdate');
    createEvent('shardDisconnect');
    createEvent('shardError');
    createEvent('shardReady');
    createEvent('shardReconnecting');
    createEvent('shardResume');
    createEvent('typingStart');
    createEvent('userUpdate');
    createEvent('voiceStateUpdate');
    createEvent('warn');
    createEvent('webhookUpdate');

    // Complete
    return;

};
module.exports = function (bot, cfg, index) {

    // Prepare Event Server. 
    // This function will tell you whether the server is logged in the firebase or not.
    let firstTime = true;
    const firstEventAdded = () => {

        // Modules
        const moment = require('moment-timezone');

        // Since I can connect from multiple devices or browser tabs, we store each connection instance separately
        // any time that connectionsRef's value is null (i.e. has no children) I am offline
        var myConnectionsRef = bot.firebase.db.main.child('dsjs/connections');

        // stores the timestamp of my last disconnect (the last time I was seen online)
        var lastOnlineRef = bot.firebase.db.main.child('dsjs/lastOnline');

        var connectedRef = bot.firebase.db.root.ref('.info/connected');
        connectedRef.on('value', (snap) => {
            if (snap.val() === true) {

                // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
                var con = myConnectionsRef.push();

                // When I disconnect, remove this device
                con.onDisconnect().remove((err) => {
                    if (err) {
                        console.group("could not establish onDisconnect event");
                        console.error(err);
                        console.groupEnd();
                    }
                });

                // Add this device to my connections list
                // this value could contain info about the device or a timestamp too
                con.set(true);

                // When I disconnect, update the last time I was seen online
                const momentTime = moment.utc().toObject();
                momentTime.timezone = 'Universal';
                lastOnlineRef.onDisconnect().set(momentTime);

            }
        });

    };

    // Start Message Cache
    require('./messageCache')(bot, cfg);

    // Create Event
    const createEvent = (eventName) => {

        // Exist
        if (cfg.events[eventName] || cfg.allEvents) {

            // First Time
            if (firstTime) { firstTime = false; firstEventAdded(); }

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
                        root: bot.firebase.db.main,
                        event: bot.firebase.db.main.child('events/' + eventName)
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
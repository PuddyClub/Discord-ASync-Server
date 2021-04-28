module.exports = function (bot, cfg, index) {

    // Create Event
    const createEvent = (eventName) => {

        // Exist
        if (cfg.events[eventName]) {

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
                bot.on(eventName, async function() {
                    await eventFunction(arguments, cfg, index);
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
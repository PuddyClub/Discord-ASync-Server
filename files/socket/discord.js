// Send Info
const sendInfo = function (ioCache, where, botID, itemSent) {

    // Validate User Session
    for (const item in ioCache.users) {
        for (const id in ioCache.users[item].ids) {
            if(ioCache.users[item].ids[id].bot && ioCache.users[item].ids[id].bot.user && ioCache.users[item].ids[id].bot.user.id === botID) {
                ioCache.users[item].ids[id].socket.emit(where, itemSent);
            }
        }
    }

    // Complete
    return;

};

// Start
const startDiscordSocket = function (ioCache, io, bot) {

    // Channel
    bot.on('channelCreate', () => { return sendInfo(ioCache, 'dsBot_channelCount', bot.user.id, bot.channels.cache.size); });
    bot.on('channelDelete', () => { return sendInfo(ioCache, 'dsBot_channelCount', bot.user.id, bot.channels.cache.size); });

    // Guild
    bot.on('guildCreate', () => { return sendInfo(ioCache, 'dsBot_serverCount', bot.user.id, bot.guilds.cache.size); });
    bot.on('guildDelete', () => { return sendInfo(ioCache, 'dsBot_serverCount', bot.user.id, bot.guilds.cache.size); });

    // Complete
    return;

};

// Export Module
module.exports = function (ioCache, io, discord) {
    for (const item in discord.bots) { startDiscordSocket(ioCache, io, discord.bots[item].bot); }
    return;
};
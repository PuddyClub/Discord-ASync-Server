module.exports = function (guild) {

    // Data
    const data = {
        afkChannelID: guild.afkChannelID,
        afkTimeout: guild.afkTimeout,
        applicationID: guild.applicationID,
        approximateMemberCount: guild.approximateMemberCount,
        approximatePresenceCount: guild.approximatePresenceCount,
        available: guild.available,
        banner: guild.banner,
        createdAt: guild.createdAt,
        createdTimestamp: guild.createdTimestamp,
        defaultMessageNotifications: guild.defaultMessageNotifications,
        deleted: guild.deleted,
        description: guild.description,
        discoverySplash: guild.discoverySplash,
        createdAt: guild.createdAt,
        createdAt: guild.createdAt,
        emojis: [],
        channels: []
    };

    // Channel Generator
    const channelGenerator = require('./channel');

    // Get Channel 
    if (guild.channels && guild.channels.cache) {
        guild.channels.cache.forEach(function (value) {
            data.channels.push(channelGenerator(value));
            return;
        });
    }

    // Emoji Generator
    const emojiGenerator = require('./emoji');

    // Get Emoji
    if (guild.emojis && guild.emojis.cache) {
        guild.emojis.cache.forEach(function (value) {
            data.emojis.push(emojiGenerator(value));
            return;
        });
    }

    // Complete
    return data;

};
module.exports = function (user) {

    // Data
    const data = {
        avatar: user.avatar,
        bot: user.bot,
        createdAt: user.createdAt,
        createdTimestamp: user.createdTimestamp,
        defaultAvatarURL: user.defaultAvatarURL,
        discriminator: user.discriminator,
        id: user.id,
        lastMessageChannelID: user.lastMessageChannelID,
        lastMessageID: user.lastMessageID,
        locale: user.locale,
        partial: user.partial,
        system: user.system,
        tag: user.tag,
        username: user.username
    };
    
    // Flags Generator
    const flagsGenerator = require('./presence/flags');
    data.flags = flagsGenerator(user.flags);

    // Presence Generator
    const presenceGenerator = require('./presence');
    data.presence = presenceGenerator(user.presence);

    // Get Members ID
    if (guild.channels && guild.channels.cache) {
        guild.channels.cache.forEach(function (value, key) {
            data.channels.push(key);
            return;
        });
    }

    // Complete
    return data;

};
module.exports = function (user) {
    if (user) {

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

        // Complete
        return data;

    } else { return null; }
};
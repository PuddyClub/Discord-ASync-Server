module.exports = function (member) {
    if (member) {

        // Data
        const data = {
            bannable: member.bannable,
            deleted: member.deleted,
            displayColor: member.displayColor,
            displayHexColor: member.displayHexColor,
            displayName: member.displayName,
            id: member.id,
            joinedAt: member.joinedAt,
            joinedTimestamp: member.joinedTimestamp,
            kickable: member.kickable,
            lastMessageChannelID: member.lastMessageChannelID,
            lastMessageID: member.lastMessageID,
            manageable: member.manageable,
            nickname: member.nickname,
            partial: member.partial,
            premiumSince: member.premiumSince,
            premiumSinceTimestamp: member.premiumSinceTimestamp,
            roles: [],
        };

        // Guild ID
        if (member.guild && member.guild.id) { data.guildID = member.guild.id; }

        // Permission Generator
        const voiceGenerator = require('./voice');
        data.voice = voiceGenerator(user.voice);

        // Permission Generator
        const permissionGenerator = require('./permissions');
        data.permissions = permissionGenerator(user.permissions);

        // Presence Generator
        const presenceGenerator = require('./presence');
        data.presence = presenceGenerator(user.presence);

        // Get Role ID
        if (member.roles && member.roles.cache) {
            member.roles.cache.forEach(function (value, key) {
                data.roles.push(key);
                return;
            });
        }

        // Complete
        return data;

    } else { return null; }
};
module.exports = function (member) {

    // Data
    const data = {
        bannable: member.bannable,
        deleted: member.deleted,
        displayColor: member.displayColor,
        displayHexColor: member.displayHexColor,
        displayName: member.displayName,
        guildID: member.guild.id,
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
    if (guild.roles && guild.roles.cache) {
        guild.roles.cache.forEach(function (value, key) {
            data.roles.push(key);
            return;
        });
    }

    // Complete
    return data;

};
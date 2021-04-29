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
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
        bannable: member.bannable,
    };

    // Permission Generator
    const permissionGenerator = require('./permissions');
    data.permissions = permissionGenerator(user.permissions);

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
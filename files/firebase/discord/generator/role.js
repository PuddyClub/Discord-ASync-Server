module.exports = function (role) {
    if (role) {

        // Data
        const data = {
            color: role.color,
            createdAt: role.createdAt,
            createdTimestamp: role.createdTimestamp,
            deleted: role.deleted,
            editable: role.editable,
            hexColor: role.hexColor,
            hoist: role.hoist,
            id: role.id,
            managed: role.managed,
            mentionable: role.mentionable,
            name: role.name,
            position: role.position,
            rawPosition: role.rawPosition,
            members: []
        };

        // Exist Guild 
        if (role.guild) { data.guildID = role.guild.id; }

        // Permission Generator
        const permissionGenerator = require('./permissions');
        data.permissions = permissionGenerator(role.permissions);

        // Get Members ID
        if (role.members && role.members.cache) {
            role.members.cache.forEach(function (value, key) {
                data.members.push(key);
                return;
            });
        }

        // Complete
        return data;

    } else { return null; }
};
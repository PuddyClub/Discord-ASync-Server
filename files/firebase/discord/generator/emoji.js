module.exports = function (emoji) {
    if (emoji) {

        // Data
        const data = {
            animated: emoji.animated,
            authorID: emoji.author.id,
            available: emoji.available,
            createdAt: emoji.createdAt,
            createdTimestamp: emoji.createdTimestamp,
            deletable: emoji.deletable,
            deleted: emoji.deleted,
            guildID: emoji.guild.id,
            id: emoji.id,
            identifier: emoji.identifier,
            managed: emoji.managed,
            name: emoji.name,
            requiresColons: emoji.requiresColons,
            url: emoji.url,
            roles: []
        };

        // Get Role ID
        if (emoji.roles && emoji.roles.cache) {
            emoji.roles.cache.forEach(function (value, key) {
                data.roles.push(key);
                return;
            });
        }

        // Complete
        return data;

    } else { return null; }
};
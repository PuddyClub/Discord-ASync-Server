module.exports = function(app) {
    if (app) {

        // Data
        const data = {
            botPublic: app.botPublic,
            botRequireCodeGrant: app.botRequireCodeGrant,
            createdAt: app.createdAt,
            createdTimestamp: app.createdTimestamp,
            description: app.description,
            icon: app.icon,
            id: app.id,
            name: app.name,
            rpcOrigins: app.rpcOrigins
        };

        // Owner
        if (app.owner) {

            // User
            if (!app.owner.ownerId) {
                const userGenerator = require('./user');
                data.owner = userGenerator(data.owner);
            }

            // Team
            else {
                const teamGenerator = require('./team');
                data.owner = teamGenerator(data.owner);
            }

        }

        // Complete
        return data;

    } else { return null; }
};
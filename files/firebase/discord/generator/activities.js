module.exports = function (activities) {
    if (activities) {

        // Data
        const data = {
            applicationID: activities.applicationID,
            createdAt: activities.createdAt,
            createdTimestamp: activities.createdTimestamp,
            details: activities.details,
            name: activities.name,
            party: activities.party,
            state: activities.state,
            timestamps: activities.timestamps,
            type: activities.type,
            state: activities.url
        };

        // Activities Generator
        const assetsGenerator = require('./presence/assets');
        const flagsGenerator = require('./presence/flags');

        data.flags = flagsGenerator(activities.flags);
        data.assets = assetsGenerator(activities.assets);

        // Emoji
        if (activities.emoji && activities.emoji.id) { data.emojiID = activities.emoji.id; }

        // Complete
        return data;

    } else { return null; }
};
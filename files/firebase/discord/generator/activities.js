module.exports = function (activities) {

    // Activities Generator
    const assetsGenerator = require('./presence/assets');
    const flagsGenerator = require('./presence/flags');

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
        state: activities.url,
        flags: flagsGenerator(activities.flags),
        assets: assetsGenerator(activities.assets),
    };

    // Emoji
    if (activities.emoji && activities.emoji.id) { data.emojiID = activities.emoji.id; }

    // Complete
    return data;

};
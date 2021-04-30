module.exports = function (presence) {
    if (presence) {

        // Activities Generator
        const activitiesGenerator = require('../activities');

        // Data
        const data = {
            clientStatus: presence.clientStatus,
            userID: presence.userID,
            status: presence.status,
            activities: activitiesGenerator(presence.activities),
        };

        // Guild ID
        if (presence.guild) { data.guildID = presence.guild.id; }

        // Complete
        return data;

    } else { return null; }
};
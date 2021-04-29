module.exports = function (presence) {
    if (presence) {

        // Activities Generator
        const activitiesGenerator = require('../activities');

        // Data
        const data = {
            clientStatus: presence.clientStatus,
            guildID: presence.guild.id,
            userID: presence.userID,
            status: presence.status,
            activities: activitiesGenerator(presence.activities),
        };

        // Complete
        return data;

    } else { return null; }
};
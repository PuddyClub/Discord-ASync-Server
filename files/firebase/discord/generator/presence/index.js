module.exports = function (presence) {
    if (presence) {

        // Activities Generator
        const activitiesGenerator = require('../activities');

        // Data
        const data = {
            clientStatus: presence.clientStatus,
            status: presence.status,
            activities: activitiesGenerator(presence.activities),
        };

        // Guild ID
        if (presence.guild && presence.guild.id) { data.guildID = presence.guild.id; }

        // User ID
        if (presence.member && presence.member.id) { data.userID = presence.member.id; }

        // Complete
        return data;

    } else { return null; }
};
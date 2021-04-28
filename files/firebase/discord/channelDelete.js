module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Channel
        const channel = cmd[0];

        // Data
        const data = require('./global/channel')(channel);

        // Guild Channel
        if (channel.type !== "dm") {

            // Exist Guild
            if (channel.guild) {



            }

        }

        // DM
        else {

        }

        // Set Event
        db.event.child('channel').set(data).then(resolve).catch(reject);

        // Complete
        return;

    });
};
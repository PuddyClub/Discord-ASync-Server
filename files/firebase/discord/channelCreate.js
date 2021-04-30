module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Channel
        const channel = cmd[0];
        if (channel) {

            // Data
            const data = require('./generator/channel')(channel);

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
            db.event.child('channel').set(db.escape(channel.id)).then(resolve).catch(reject);

        }

        // Nothing
        else { resolve(); }

        // Complete
        return;

    });
};
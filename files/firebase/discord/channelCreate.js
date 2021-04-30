module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Channel
        const channel = cmd[0];

        // Data
        const data = db.escape(require('./generator/channel')(channel));

        // Guild Channel
        if (channel.type !== "dm") {

            // Exist Guild
            if (channel.guild) {



            }

        }

        // DM
        else {

        }

        // Channel ID
        const channelID = db.escape(channel.id);

        // Set Channel
        db.root.child('channels').child().set();

        // Set Event
        db.event.child('channel').set(data).then(resolve).catch(reject);

        // Complete
        return;

    });
};
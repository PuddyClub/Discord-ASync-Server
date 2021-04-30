module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Channel
        const oldChannel = cmd[0];
        const newChannel = cmd[1];

        // Data
        const channelGenerator = require('./generator/channel');
        const oldData = db.escape(channelGenerator(oldChannel));
        const newData = db.escape(channelGenerator(newChannel));

        // Guild Channel
        if (newData.type !== "dm") {

            // Exist Guild
            if (newData.guild) {



            }

        }

        // DM
        else {

        }

        // Set Event
        db.event.set({
            oldChannel: oldData,
            newChannel: newChannel.id
        }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Channel
        const oldChannel = cmd[0];
        const newChannel = cmd[1];

        // Data
        const channelGenerator = require('./generator/channel');
        const oldData = channelGenerator(oldChannel);
        const newData = channelGenerator(newChannel);

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
        db.event.set({
            oldChannel: oldData,
            newChannel: newChannel.id
        }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
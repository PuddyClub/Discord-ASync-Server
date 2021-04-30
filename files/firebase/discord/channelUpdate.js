module.exports = function (cmd, db, cfg) {
    return new Promise(async (resolve, reject) => {

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

                // Channel ID
                const channelID = db.escape(newChannel.id);

                // Channel ID
                const guildID = db.escape(newChannel.guild.id);

                // Update Channel
                await db.root.child('guilds').child(guildID).child('channels').child(channelID).update(newData);

            }

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
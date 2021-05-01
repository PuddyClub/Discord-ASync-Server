module.exports = function (cmd, db, cfg) {
    return new Promise(async (resolve, reject) => {

        // Channel
        const channel = cmd[0];

        // Data
        const data = db.escape(require('./generator/channel')(channel));

        // Guild Channel
        if (channel.type !== "dm") {

            // Exist Guild
            if (channel.guild) {

                // Channel ID
                const channelID = db.escape(channel.id);

                // Guild ID
                const guildID = db.escape(channel.guild.id);

                // Update Channel
                await db.root.child('guilds').child(guildID).child('channels').child(channelID).update(data);

            }

        }

        // Set Event
        db.event.child('channel').set(data).then(resolve).catch(reject);

        // Complete
        return;

    });
};
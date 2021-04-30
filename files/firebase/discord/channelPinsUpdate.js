module.exports = function (cmd, db, cfg) {
    return new Promise(async (resolve, reject) => {

        // Items
        const channel = cmd[0];
        const time = cmd[1];

        // Data
        const data = db.escape(require('./generator/channel')(channel));

        // Channel ID
        const channelID = db.escape(channel.id);

        // Channel ID
        const guildID = db.escape(channel.guild.id);

        // Update Channel
        await db.root.child('guilds').child(guildID).child('channels').child(channelID).update(data);

        // Set Event
        db.event.set({ channel: db.escape(channel.id), time: db.escape(time) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
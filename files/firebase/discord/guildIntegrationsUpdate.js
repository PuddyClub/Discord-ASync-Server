module.exports = function (cmd, db, cfg) {
    return new Promise(async (resolve, reject) => {

        // Guild
        const guild = cmd[0];

        // Data
        const guildGenerator = require('./generator/guild');
        const data = db.escape(guildGenerator(guild));

        // Guild ID
        const guildID = db.escape(guild.id);

        // Update Channel
        await db.root.child('guilds').child(guildID).update(data);

        // Set Event
        db.event.set({ guild: db.escape(guild.id) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
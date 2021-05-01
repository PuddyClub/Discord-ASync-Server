module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Guild
        const guild = cmd[0];

        // Data
        const guildGenerator = require('./generator/guild');
        const data = db.escape(guildGenerator(guild));

        // Guild ID
        const guildID = db.escape(guild.id);

        // Update Channel
        await db.root.child('guilds').child(guildID).remove();

        // Set Event
        db.event.set({ guild: data }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
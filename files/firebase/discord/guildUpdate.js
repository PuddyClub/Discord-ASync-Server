module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Guild
        const oldGuild = cmd[0];
        const newGuild = cmd[1];

        // Data
        const guildGenerator = require('./generator/guild');
        const oldData = db.escape(guildGenerator(oldGuild));
        const newData = db.escape(guildGenerator(newGuild));

        // Guild ID
        const guildID = db.escape(newGuild.id);

        // Update Channel
        await db.root.child('guilds').child(guildID).update(newData);

        // Set Event
        db.event.set({ oldMember: oldData, newMember: db.escape(newGuild.id) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
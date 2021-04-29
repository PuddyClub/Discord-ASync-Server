module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Emoji
        const oldGuild = cmd[0];
        const newGuild = cmd[1];

        // Data
        const guildGenerator = require('./generator/guild');
        const oldData = guildGenerator(oldGuild);
        const newData = guildGenerator(newGuild);

        // Set Event
        db.event.set({oldMember: oldData, newMember: newGuild.id}).then(resolve).catch(reject);

        // Complete
        return;

    });
};
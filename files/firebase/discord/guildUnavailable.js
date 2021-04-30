module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Guild
        const guild = cmd[0];

        // Data
        const guildGenerator = require('./generator/guild');
        const data = db.escape(guildGenerator(guild));

        // Set Event
        db.event.set({ guild: db.escape(guild.id) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
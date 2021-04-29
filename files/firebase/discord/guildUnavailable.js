module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Emoji
        const guild = cmd[0];

        // Data
        const guildGenerator = require('./generator/guild');
        const data = guildGenerator(guild);

        // Set Event
        db.event.set({ guild: guild.id }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
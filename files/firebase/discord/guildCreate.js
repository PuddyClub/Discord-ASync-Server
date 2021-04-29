module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Emoji
        const guild = cmd[0];

        // Data
        const guildGenerator = require('./generator/guild');
        const data = guildGenerator(user);

        // Set Event
        db.event.set({ guild: data }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
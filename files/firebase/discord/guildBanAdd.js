module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Guild
        const guild = cmd[0];
        const user = cmd[1];

        // Data
        const userGenerator = require('./generator/user');
        const userData = db.escape(userGenerator(user));

        // Set Event
        db.event.set({user: userData, guildID: db.escape(guild.id) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
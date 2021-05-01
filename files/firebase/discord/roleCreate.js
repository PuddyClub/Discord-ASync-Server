module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Role
        const role = cmd[0];

        // Data
        const roleGenerator = require('./generator/role');
        const data = db.escape(roleGenerator(role));

        // Role ID
        const roleID = db.escape(role.id);

        // Guild ID
        const guildID = db.escape(role.guild.id);

        // Update Channel
        await db.root.child('guilds').child(guildID).child('roles').child(roleID).set(data);

        // Set Event
        db.event.set({ role: data }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
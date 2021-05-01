module.exports = function (cmd, db, cfg) {
    return new Promise(async (resolve, reject) => {

        // Roles
        const oldRole = cmd[0];
        const newRole = cmd[1];

        // Data
        const roleGenerator = require('./generator/role');
        const oldData = db.escape(roleGenerator(oldRole));
        const newData = db.escape(roleGenerator(newRole));

        // Role ID
        const roleID = db.escape(newRole.id);

        // Guild ID
        const guildID = db.escape(newRole.guild.id);

        // Update Channel
        await db.root.child('guilds').child(guildID).child('roles').child(roleID).update(newData);

        // Set Event
        db.event.set({ oldRole: oldData, newRole: db.escape(newRole.id) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Message
        const oldRole = cmd[0];
        const newRole = cmd[1];

        // Data
        const roleGenerator = require('./generator/role');
        const oldData = roleGenerator(oldRole);
        const newData = roleGenerator(newRole);

        // Set Event
        db.event.set({ oldRole: oldData, newRole: newData }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
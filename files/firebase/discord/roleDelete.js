module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Role
        const role = cmd[0];

        // Data
        const roleGenerator = require('./generator/role');
        const data = roleGenerator(role);

        // Set Event
        db.event.set({ role: data }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
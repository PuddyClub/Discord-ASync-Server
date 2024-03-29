module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Data
        const oldUser = cmd[0];
        const newUser = cmd[1];

        // Data
        const userGenerator = require('./generator/user');
        const oldData = db.escape(userGenerator(oldUser));
        const newData = db.escape(userGenerator(newUser));

        // Set Event
        db.event.set({ newUser: newData, oldUser: oldData }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Message
        const oldPresence = cmd[0];
        const newPresence = cmd[1];

        // Data
        const presenceGenerator = require('./generator/presence');
        const oldData = db.escape(presenceGenerator(oldPresence));
        const newData = db.escape(presenceGenerator(newPresence));

        // Set Event
        db.event.set({ oldPresence: oldData, newPresence: newData }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
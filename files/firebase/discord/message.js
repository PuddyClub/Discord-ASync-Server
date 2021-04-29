module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Error
        const msg = cmd[0];

        // Data
        const messageGenerator = require('./generator/message');
        const data = messageGenerator(msg);

        // Set Event
        db.event.set({ invite: data }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
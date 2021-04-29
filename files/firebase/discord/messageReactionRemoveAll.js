module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Message
        const msg = cmd[0];

        // Data
        const messageGenerator = require('./generator/message');
        const data = messageGenerator(msg);

        // Set Event
        db.event.set({ message: data }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
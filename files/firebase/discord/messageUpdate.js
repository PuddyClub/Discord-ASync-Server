module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Message
        const oldMessage = cmd[0];
        const newMessage = cmd[1];

        // Data
        const messageGenerator = require('./generator/message');
        const oldData = messageGenerator(oldMessage);
        const newData = messageGenerator(newMessage);

        // Set Event
        db.event.set({ oldMessage: oldData, newMessage: newData }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
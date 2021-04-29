module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Data
        const msgs = cmd[0];
        const data = [];

        // Prepare
        const messageGenerator = require('./generator/message');

        // Get Data
        msgs.forEach(function (value) {
            data.push(messageGenerator(value));
            return;
        });
        

        // Set Event
        db.event.set({ messages: data }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
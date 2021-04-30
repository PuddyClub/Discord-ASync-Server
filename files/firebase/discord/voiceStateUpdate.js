module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Data
        const oldState = cmd[0];
        const newState = cmd[1];

        // Data
        const voiceGenerator = require('./generator/voice');
        const oldData = db.escape(voiceGenerator(oldState));
        const newData = db.escape(voiceGenerator(newState));

        // Set Event
        db.event.set({ newState: newData, oldState: oldData }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
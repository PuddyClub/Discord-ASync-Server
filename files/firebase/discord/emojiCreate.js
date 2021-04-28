module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Emoji
        const emoji = cmd[0];

        // Data
        const data = require('./generator/emoji')(emoji);

        // Set Event
        db.event.child('emoji').set(data).then(resolve).catch(reject);

        // Complete
        return;

    });
};
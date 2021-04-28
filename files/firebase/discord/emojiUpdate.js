module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Emoji
        const oldEmoji = cmd[0];
        const newEmoji = cmd[1];

        // Data
        const emojiGenerator = require('./generator/channel');
        const oldData = emojiGenerator(oldEmoji);
        const newData = emojiGenerator(newEmoji);

        // Set Event
        db.event.set({oldEmoji: oldData, newEmoji: newData}).then(resolve).catch(reject);

        // Complete
        return;

    });
};
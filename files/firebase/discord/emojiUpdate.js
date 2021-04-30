module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Emoji
        const oldEmoji = cmd[0];
        const newEmoji = cmd[1];

        // Data
        const emojiGenerator = require('./generator/channel');
        const oldData = db.escape(emojiGenerator(oldEmoji));
        const newData = db.escape(emojiGenerator(newEmoji));

        // Set Event
        db.event.set({oldEmoji: oldData, newEmoji: db.escape(newEmoji.id)}).then(resolve).catch(reject);

        // Complete
        return;

    });
};
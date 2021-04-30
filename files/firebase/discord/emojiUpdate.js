module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Emoji
        const oldEmoji = cmd[0];
        const newEmoji = cmd[1];

        // Data
        const emojiGenerator = require('./generator/channel');
        const oldData = db.escape(emojiGenerator(oldEmoji));
        const newData = db.escape(emojiGenerator(newEmoji));

        // Emoji ID
        const emojiID = db.escape(newEmoji.id);

        // Channel ID
        const guildID = db.escape(newEmoji.guild.id);

        // Set Channel
        db.root.child('emojis').child(emojiID).set(guildID);

        // Update Channel
        await db.root.child('guilds').child(guildID).child('emojis').child(emojiID).update(newData);

        // Set Event
        db.event.set({ oldEmoji: oldData, newEmoji: db.escape(newEmoji.id) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
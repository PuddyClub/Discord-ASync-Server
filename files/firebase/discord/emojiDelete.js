module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Emoji
        const emoji = cmd[0];

        // Data
        const data = db.escape(require('./generator/emoji')(emoji));

        // Emoji ID
        const emojiID = db.escape(emoji.id);

        // Channel ID
        const guildID = db.escape(emoji.guild.id);

        // Update Channel
        await db.root.child('guilds').child(guildID).child('emojis').child(emojiID).remove();

        // Set Event
        db.event.child('emoji').set(data).then(resolve).catch(reject);

        // Complete
        return;

    });
};
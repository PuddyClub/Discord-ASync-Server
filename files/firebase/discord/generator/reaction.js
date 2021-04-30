module.exports = function (reaction) {
    if (reaction) {

        // Data
        const data = {
            count: reaction.count,
            me: reaction.me,
            partial: reaction.partial,
            users: []
        };

        // Emoji Reaction Generator
        if (reaction.emoji) {

            // Guild
            if (reaction.emoji.guild) {
                const emojiGenerator = require('./emoji');
                data.emoji = emojiGenerator(reaction.emoji);
            }

            // Nope
            else {
                const reactionEmojiGenerator = require('./reactionEmoji');
                data.emoji = reactionEmojiGenerator(reaction.emoji);
            }

        }

        // Message ID
        if (reaction.message && reaction.message.id) { data.messageID = reaction.message.id; }

        // Get Users
        if (reaction.users && reaction.users.cache) {
            reaction.users.cache.forEach(function (value, key) {
                data.users.push(key);
                return;
            });
        }

        // Complete
        return data;

    } else { return null; }
};
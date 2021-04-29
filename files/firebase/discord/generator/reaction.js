module.exports = function (reaction) {
    if (reaction) {

        // Data
        const data = {
            count: reaction.count,
            count: reaction.count,
            count: reaction.count,
            count: reaction.count,
            count: reaction.count,
            count: reaction.count,
            count: reaction.count,
            count: reaction.count,
            count: reaction.count,
            count: reaction.count
        };

        // Emoji Reaction Generator
        if (reaction.emoji) {

            // Guild
            if(reaction.emoji.guild) {
                const emojiGenerator = require('./emoji');
                data.emoji = emojiGenerator(reaction.emoji);
            }

            // Nope
            else {
                const reactionEmojiGenerator = require('./reactionEmoji');
                data.emoji = reactionEmojiGenerator(reaction.emoji);
            }

        }

        // Complete
        return data;

    } else { return null; }
};
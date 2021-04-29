module.exports = function (emoji) {
    if (emoji) {

        // Data
        const data = {
            animated: emoji.animated,
            createdAt: emoji.createdAt,
            createdTimestamp: emoji.createdTimestamp,
            deleted: emoji.deleted,
            id: emoji.id,
            identifier: emoji.identifier,
            name: emoji.name,
            url: emoji.url,
        };

        // Message ID
        if (msg.reaction && msg.reaction.message && msg.reaction.message.id) { data.messageID = msg.reaction.message.id; }

        // Complete
        return data;

    } else { return null; }
};
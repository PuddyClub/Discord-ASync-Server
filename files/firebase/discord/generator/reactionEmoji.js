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
        if (emoji.reaction && emoji.reaction.message && emoji.reaction.message.id) { data.messageID = emoji.reaction.message.id; }

        // Complete
        return data;

    } else { return null; }
};
module.exports = function (attachment) {
    if (attachment) {

        // Data
        const data = {
            height: attachment.height,
            id: attachment.id,
            name: attachment.name,
            proxyURL: attachment.proxyURL,
            size: attachment.size,
            spoiler: attachment.spoiler,
            url: attachment.url,
            width: attachment.width
        };

        // Complete
        return data;

    } else { return null; }
};
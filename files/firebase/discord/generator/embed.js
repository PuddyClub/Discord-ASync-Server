module.exports = function (embed) {
    if (embed) {

        // Data
        const data = {
            author: embed.author,
            color: embed.color,
            createdAt: embed.createdAt,
            description: embed.description,
            fields: embed.fields,
            files: embed.files,
            footer: embed.footer,
            hexColor: embed.hexColor,
            image: embed.image,
            length: embed.length,
            provider: embed.provider,
            thumbnail: embed.thumbnail,
            timestamp: embed.timestamp,
            title: embed.title,
            type: embed.type,
            url: embed.url,
            video: embed.video
        };

        // Complete
        return data;

    } else { return null; }
};
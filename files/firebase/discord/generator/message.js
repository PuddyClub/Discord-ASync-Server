module.exports = function (msg) {
    if (msg) {

        // Data
        const data = {
            activity: msg.activity,
            cleanContent: msg.cleanContent,
            content: msg.content,
            createdAt: msg.createdAt,
            createdTimestamp: msg.createdTimestamp,
            crosspostable: msg.crosspostable,
            deletable: msg.deletable,
            deleted: msg.deleted,
            editable: msg.editable,
            editedAt: msg.editedAt,
            editedTimestamp: msg.editedTimestamp,
            embeds: msg.embeds,
            id: msg.id,
            partial: msg.partial,
            pinnable: msg.pinnable,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            pinned: msg.pinned,
            embeds: [],
            attachments: [],
        };

        // Application Generator
        const applicationGenerator = require('./application');
        data.application = applicationGenerator(embed.application);

        // Mentions Generator
        const mentionsGenerator = require('./mentions');
        data.mentions = mentionsGenerator(embed.mentions);

        // Tags Generator
        const flagsGenerator = require('./presence/flags');
        data.flags = flagsGenerator(embed.flags);

        // Channel ID
        if (msg.channel && msg.channel.id) { data.channelID = msg.channel.id; }

        // Guild ID
        if (msg.guild && msg.guild.id) { data.guildID = msg.guild.id; }

        // Author ID
        if (msg.author && msg.author.id) { data.authorID = msg.author.id; }

        // Get Reactions
        if (msg.reactions && msg.reactions.cache) {
            const reactionsGenerator = require('./reaction');
            msg.reactions.cache.forEach(function (value) {
                data.reactions.push(reactionsGenerator(value));
                return;
            });
        }

        // Get Attachments
        if (msg.attachments) {
            const attachmentsGenerator = require('./attachments');
            msg.attachments.forEach(function (value) {
                data.attachments.push(attachmentsGenerator(value));
                return;
            });
        }

        // Embed
        if (Array.isArray(msg.embeds)) {
            const embedsGenerator = require('./embed');
            for (const item in msg.embeds) {
                data.embeds.push(embedsGenerator(msg.embeds[item]));
            }
        }

        // Complete
        return data;

    } else { return null; }
};
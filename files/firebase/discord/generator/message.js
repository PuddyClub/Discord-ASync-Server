module.exports = function (msg) {
    if (msg) {

        // Data
        const data = {
            activity: msg.activity,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
            code: msg.code,
        };

        // Application Generator
        const applicationGenerator = require('./application');
        data.application = applicationGenerator(role.application);

        // Channel ID
        if (msg.channel && msg.channel.id) { data.channelID = msg.channel.id; }

        // Guild ID
        if (msg.guild && msg.guild.id) { data.guildID = msg.guild.id; }

        // Get Attachments
        if (msg.attachments && msg.attachments.cache) {
            const attachmentsGenerator = require('./attachments');
            msg.attachments.cache.forEach(function (value) {
                data.attachments.push(attachmentsGenerator(value));
                return;
            });
        }

        // Complete
        return data;

    } else { return null; }
};
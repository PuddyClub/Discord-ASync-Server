// Send Info
const sendInfo = function(ioCache, where, botID, itemSent, perm = 1, guildID, type = 'general') {

    // Validate User Session
    if (ioCache.users) {
        for (const item in ioCache.users) {
            for (const id in ioCache.users[item].ids) {
                if (

                    // Is Bot
                    ioCache.users[item].ids[id].bot &&

                    // Bot User
                    ioCache.users[item].ids[id].bot.user &&

                    // Is Same Bot ID
                    ioCache.users[item].ids[id].bot.user.id === botID &&

                    // Permission
                    ioCache.users[item].checkPerm(perm, type, botID, guildID) &&

                    // Guild
                    (typeof guildID !== "string" || (
                        ioCache.users[item].ids[id].guild &&
                        (typeof ioCache.users[item].ids[id].guild.id === "string" || typeof ioCache.users[item].ids[id].guild.id === "number") &&
                        ioCache.users[item].ids[id].guild.id === guildID
                    ))

                ) {
                    ioCache.users[item].ids[id].socket.emit(where, itemSent);
                }
            }
        }
    }

    // Complete
    return;

};

// Update Log
const updateDiscordLog = function(ioCache, logList, botID, where, itemResult) {

    // Add To Log
    logList.push(itemResult);

    // Check Log Size
    if (logList.length > 500) { logList.shift(); }

    // Complete
    return sendInfo(ioCache, 'dsBot_' + where, botID, { item: itemResult, list: logList }, 4);

};

// Start
const startDiscordSocket = function(ioCache, io, data) {

    // Get Bot
    const bot = data.bot;

    // Create Log
    data.log = {};

    // Create Info
    data.log.info = [];

    // Create Error
    data.log.error = [];

    // Create Warn
    data.log.warn = [];

    // Create Rate Limit
    data.log.rateLimit = [];

    // Create Rate Limit
    data.log.shardError = [];

    // Log Items
    bot.on('rateLimit', (info) => { return updateDiscordLog(ioCache, data.log.rateLimit, bot.user.id, 'rateLimit', info); });
    bot.on('warn', (info) => { return updateDiscordLog(ioCache, data.log.warn, bot.user.id, 'warn', info); });
    bot.on('error', (info) => { return updateDiscordLog(ioCache, data.log.error, bot.user.id, 'error', info); });
    bot.on('shardError', (err, shardID) => { return updateDiscordLog(ioCache, data.log.shardError, bot.user.id, 'shardError', { err: err, shardID: shardID }); });

    // Channel
    bot.on('channelCreate', () => { sendInfo(ioCache, 'dsBot_channelCount', bot.user.id, bot.channels.cache.size); return; });
    bot.on('channelDelete', () => { sendInfo(ioCache, 'dsBot_channelCount', bot.user.id, bot.channels.cache.size); return; });

    // Guild
    bot.on('guildCreate', () => { sendInfo(ioCache, 'dsBot_serverCount', bot.user.id, { value: bot.guilds.cache.size, isCount: false }); return; });
    bot.on('guildDelete', () => { sendInfo(ioCache, 'dsBot_serverCount', bot.user.id, { value: bot.guilds.cache.size, isCount: false }); return; });

    // Guild Item
    const updateGuildData = async(guild) => {

        // Exist Guild
        if (guild) {

            // Update Guild Count
            sendInfo(ioCache, 'dsBot_guildMemberCount', bot.user.id, guild.memberCount, 2, guild.id, 'guild');

            // Send Guild Data
            sendInfo(ioCache, 'dsBot_guildFeatures', bot.user.id, guild.features, 2, guild.id, 'guild');
            sendInfo(ioCache, 'dsBot_guildName', bot.user.id, guild.name, 2, guild.id, 'guild');
            sendInfo(ioCache, 'dsBot_guildCreationDate', bot.user.id, require('moment-timezone')(guild.createdAt).format('YYYY-MM-DD'), 2, guild.id, 'guild');

            const guildOwner = await guild.members.fetch(guild.ownerId);
            sendInfo(ioCache, 'dsBot_guildOwner', bot.user.id, {
                id: guildOwner.user.id,
                tag: guildOwner.user.tag,
                username: guildOwner.user.username,
                nickname: guildOwner.nickname,
                discriminator: guildOwner.user.discriminator
            }, 2, guild.id, 'guild');

        }

        // Complete
        return;

    };
    bot.on('guildCreate', (guild) => { return updateGuildData(guild); });
    bot.on('guildUpdate', (oldGuild, guild) => { return updateGuildData(guild); });
    bot.on('guildIntegrationsUpdate', (guild) => { return updateGuildData(guild); });

    // Rest Guild

    bot.on('guildMemberAdd', (member) => { if (member.guild) { sendInfo(ioCache, 'dsBot_guildMemberCount', bot.user.id, member.guild.memberCount, 2, member.guild.id, 'guild'); } return; });
    bot.on('guildMemberRemove', (member) => { if (member.guild) { sendInfo(ioCache, 'dsBot_guildMemberCount', bot.user.id, member.guild.memberCount, 2, member.guild.id, 'guild'); } return; });

    bot.on('roleCreate', (role) => { if (role.guild) { sendInfo(ioCache, 'dsBot_guildRoleCount', bot.user.id, role.guild.roles.cache.size, 2, role.guild.id, 'guild'); } return; });
    bot.on('roleDelete', (role) => { if (role.guild) { sendInfo(ioCache, 'dsBot_guildRoleCount', bot.user.id, role.guild.roles.cache.size, 2, role.guild.id, 'guild'); } return; });

    bot.on('channelCreate', (channel) => { if (channel.guild) { sendInfo(ioCache, 'dsBot_guildChannelsCount', bot.user.id, channel.guild.channels.cache.size, 2, channel.guild.id, 'guild'); } return; });
    bot.on('channelDelete', (channel) => { if (channel.guild) { sendInfo(ioCache, 'dsBot_guildChannelsCount', bot.user.id, channel.guild.channels.cache.size, 2, channel.guild.id, 'guild'); } return; });

    bot.on('emojiCreate', (emoji) => { if (emoji.guild) { sendInfo(ioCache, 'dsBot_guildEmojiCount', bot.user.id, emoji.guild.emojis.cache.size, 2, emoji.guild.id, 'guild'); } return; });
    bot.on('emojiDelete', (emoji) => { if (emoji.guild) { sendInfo(ioCache, 'dsBot_guildEmojiCount', bot.user.id, emoji.guild.emojis.cache.size, 2, emoji.guild.id, 'guild'); } return; });

    // Complete
    return;

};

// Export Module
module.exports = function(ioCache, io, discord) {
    for (const item in discord.bots) { startDiscordSocket(ioCache, io, discord.bots[item]); }
    return;
};
// Send Info
const sendInfo = function (ioCache, where, botID, itemSent, perm = 1, guildID, type = 'general') {

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
                        (typeof ioCache.users[item].ids[id].guild.id === "string" || ioCache.users[item].ids[id].guild.id === "number") &&
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
const updateDiscordLog = function (ioCache, logList, botID, where, itemResult) {

    // Add To Log
    logList.push(itemResult);

    // Check Log Size
    if (logList.length > 500) { logList.shift(); }

    // Complete
    return sendInfo(ioCache, 'dsBot_' + where, botID, { item: itemResult, list: logList }, 4);

};

// Start
const startDiscordSocket = function (ioCache, io, data) {

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
    bot.on('channelCreate', () => { return sendInfo(ioCache, 'dsBot_channelCount', bot.user.id, bot.channels.cache.size); });
    bot.on('channelDelete', () => { return sendInfo(ioCache, 'dsBot_channelCount', bot.user.id, bot.channels.cache.size); });

    // Guild
    bot.on('guildCreate', () => { return sendInfo(ioCache, 'dsBot_serverCount', bot.user.id, { value: bot.guilds.cache.size, isCount: false }); });
    bot.on('guildDelete', () => { return sendInfo(ioCache, 'dsBot_serverCount', bot.user.id, { value: bot.guilds.cache.size, isCount: false }); });

    // Guild Item
    const updateGuildData = async (guild) => {

        // Update Guild Count
        sendInfo(ioCache, 'dsBot_guildMemberCount', bot.user.id, guild.memberCount, 2, guild.id, 'guild');

        // Send Guild Data
        sendInfo(ioCache, 'dsBot_guildFeatures', bot.user.id, guild.features, 2, guild.id, 'guild');
        sendInfo(ioCache, 'dsBot_guildRegion', bot.user.id, guild.region, 2, guild.id, 'guild');
        sendInfo(ioCache, 'dsBot_guildName', bot.user.id, guild.name, 2, guild.id, 'guild');
        sendInfo(ioCache, 'dsBot_guildCreationDate', bot.user.id, require('moment-timezone')(guild.createdAt).format('YYYY-MM-DD'), 2, guild.id, 'guild');
        
        const guildOwner = await guild.members.fetch(guild.ownerID);
        sendInfo(ioCache, 'dsBot_guildOwner', bot.user.id, {
            id: guildOwner.user.id,
            tag: guildOwner.user.tag,
            username: guildOwner.user.username,
            nickname: guildOwner.nickname,
            discriminator: guildOwner.user.discriminator
        }, 2, guild.id, 'guild');

        // Complete
        return;

    };
    bot.on('guildCreate', (guild) => { return updateGuildData(guild); });
    bot.on('guildUpdate', (oldGuild, guild) => { return updateGuildData(guild); });
    bot.on('guildIntegrationsUpdate', (guild) => { return updateGuildData(guild); });

    // Rest Guild

    bot.on('guildMemberAdd', (member) => { return sendInfo(ioCache, 'dsBot_guildMemberCount', bot.user.id, member.guild.memberCount, 2, member.guild.id, 'guild'); });
    bot.on('guildMemberRemove', (member) => { return sendInfo(ioCache, 'dsBot_guildMemberCount', bot.user.id, member.guild.memberCount, 2, member.guild.id, 'guild'); });

    bot.on('roleCreate', (role) => { return sendInfo(ioCache, 'dsBot_guildRoleCount', bot.user.id, role.guild.roles.cache.size, 2, role.guild.id, 'guild'); });
    bot.on('roleDelete', (role) => { return sendInfo(ioCache, 'dsBot_guildRoleCount', bot.user.id, role.guild.roles.cache.size, 2, role.guild.id, 'guild'); });

    bot.on('channelCreate', (channel) => { return sendInfo(ioCache, 'dsBot_guildChannelsCount', bot.user.id, channel.guild.channels.cache.size, 2, channel.guild.id, 'guild'); });
    bot.on('channelDelete', (channel) => { return sendInfo(ioCache, 'dsBot_guildChannelsCount', bot.user.id, channel.guild.channels.cache.size, 2, channel.guild.id, 'guild'); });

    bot.on('emojiCreate', (emoji) => { return sendInfo(ioCache, 'dsBot_guildEmojiCount', bot.user.id, emoji.guild.emojis.cache.size, 2, emoji.guild.id, 'guild'); });
    bot.on('emojiDelete', (emoji) => { return sendInfo(ioCache, 'dsBot_guildEmojiCount', bot.user.id, emoji.guild.emojis.cache.size, 2, emoji.guild.id, 'guild'); });

    // Complete
    return;

};

// Export Module
module.exports = function (ioCache, io, discord) {
    for (const item in discord.bots) { startDiscordSocket(ioCache, io, discord.bots[item]); }
    return;
};
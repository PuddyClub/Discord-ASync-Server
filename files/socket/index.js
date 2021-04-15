module.exports = function (pluginSocket, socket, ioCache, io, session, web, app, socketUser, userData) {

    // Discord User Data
    const user = socketUser.data;
    socketUser.sUser = userData;

    // Send Log
    socketUser.sendLog = function (type, isAll = false, data) {
        if (typeof type === "string" && socketUser.checkPerm(4)) {

            // Send Log
            const sendLog = function (botID) {

                // Get Discord App
                const botData = app.discord.bots.find(tbot => tbot.bot && tbot.bot.user && tbot.bot.user.id === botID);
                if (botData && botData.log && botData.log[type]) {

                    // Add To Log
                    botData.log[type].push(data);

                    // Check Log Size
                    if (botData.log[type].length > 500) { botData.log[type].shift(); }

                    // Complete
                    socket.emit('dsBot_' + type, { item: data, list: botData.log[type] });

                }

            };

            // Type Log Fix
            if (type === "log") { type = 'info'; }

            // Is Bot
            if (!isAll && socketUser.ids[socket.id] && socketUser.ids[socket.id].bot && socketUser.ids[socket.id].bot.user && socketUser.ids[socket.id].bot.user.id) {
                sendLog(socketUser.ids[socket.id].bot.user.id);
            }

            // Nope
            else {
                for (const item in app.discord.bots) {
                    if (app.discord.bots[item].bot && app.discord.bots[item].bot.user && app.discord.bots[item].bot.user.id) {
                        sendLog(app.discord.bots[item].bot.user.id);
                    }
                }
            }

        }
    };

    // Check User Permission
    socketUser.checkPerm = (perm = 0, type = 'general', botID = null, guildID = null) => {

        // Allowed
        if (

            // Global Perm
            socketUser.sUser.perm >= perm ||

            // Guild Perm
            ((typeof guildID === "string" || typeof guildID === "number") && (type === 'guild' || type === 'general') && socketUser.sUser.guildsPerm && socketUser.sUser.guildsPerm[guildID] >= perm) ||

            // Bot Perm
            ((typeof botID === "string" || typeof botID === "number") && (type === 'bot' || type === 'general') && socketUser.sUser.botsPerm && socketUser.sUser.botsPerm[botID] >= perm)

        ) { return true; }

        // Nope
        else { return false; }

    };

    // Connect Discord Bot Guild
    socket.on('updateCountPage', async function (type) {

        // Exist Guild
        if (socketUser.ids[socket.id].guild) {

            // Connected
            socket.emit('dsBot_guildMemberCount', socketUser.ids[socket.id].guild.memberCount);
            socket.emit('dsBot_guildRoleCount', socketUser.ids[socket.id].guild.roles.cache.size);
            socket.emit('dsBot_guildEmojiCount', socketUser.ids[socket.id].guild.emojis.cache.size);

            socket.emit('dsBot_guildFeatures', socketUser.ids[socket.id].guild.features);
            socket.emit('dsBot_guildRegion', socketUser.ids[socket.id].guild.region);
            socket.emit('dsBot_guildName', socketUser.ids[socket.id].guild.name);
            socket.emit('dsBot_guildChannelsCount', socketUser.ids[socket.id].guild.channels.cache.size);
            socket.emit('dsBot_guildCreationDate', require('moment-timezone')(socketUser.ids[socket.id].guild.createdAt).format('YYYY-MM-DD'));

            const guildOwner = await socketUser.ids[socket.id].guild.members.fetch(socketUser.ids[socket.id].guild.ownerID);
            socket.emit('dsBot_guildOwner', {
                id: guildOwner.user.id,
                tag: guildOwner.user.tag,
                username: guildOwner.user.username,
                nickname: guildOwner.nickname,
                discriminator: guildOwner.user.discriminator
            });

        }

        // Exist Bot
        if (socketUser.ids[socket.id].bot) {
            socket.emit('dsBot_serverCount', { value: socketUser.ids[socket.id].bot.guilds.cache.size, isCount: true });
            socket.emit('dsBot_channelCount', socketUser.ids[socket.id].bot.channels.cache.size);
        }

        // Send Logs
        if (socketUser.ids[socket.id].log) {
            socket.emit('dsBot_error', { item: null, list: socketUser.ids[socket.id].log.error });
            socket.emit('dsBot_warn', { item: null, list: socketUser.ids[socket.id].log.warn });
            socket.emit('dsBot_rateLimit', { item: null, list: socketUser.ids[socket.id].log.rateLimit });
            socket.emit('dsBot_shardError', { item: null, list: socketUser.ids[socket.id].log.shardError });
            socket.emit('dsBot_info', { item: null, list: socketUser.ids[socket.id].log.info });
        }

        // Complete
        return;

    });

    // Connect Discord Bot Guild
    socket.on('connectDiscordGuild', async function (guildID, fn) {

        // Is String
        if (
            socketUser.ids[socket.id].bot && socketUser.ids[socket.id].bot.user && socketUser.ids[socket.id].bot.user.id &&
            (typeof guildID === "string" || typeof guildID === "number") &&
            socketUser.checkPerm(2, 'guild', socketUser.ids[socket.id].bot.user.id, guildID)
        ) {

            // Find Guild
            const guild = await socketUser.ids[socket.id].bot.guilds.fetch(guildID);
            if (guild) {

                // Set Guild Value
                socketUser.ids[socket.id].guild = guild;

                // Complete
                fn({
                    success: true,
                    name: guild.name,
                    icon: guild.iconURL({ size: 32 })
                });

            }

            // Nope
            else { socketUser.ids[socket.id].guild = null; fn({ success: false }); }

        }

        // Nope
        else { fn({ success: false }); }

        // Complete
        return;

    });

    // Connect Discord Bot
    socket.on('connectDiscordBot', function (botID, fn) {

        // Is String
        if ((typeof botID === "string" || typeof botID === "number") && socketUser.checkPerm(2, 'bot', botID)) {

            // Get Bot
            const item = app.discord.bots.find(item => item.bot.user.id === botID);
            if (item) {

                // Get the Bot
                socketUser.ids[socket.id].log = item.log;
                socketUser.ids[socket.id].bot = item.bot;
                socketUser.ids[socket.id].room = 'dashboard';
                socketUser.ids[socket.id].guild = null;

                // Complete
                fn({
                    success: true,
                    tag: socketUser.ids[socket.id].bot.user.tag,
                    avatar: socketUser.ids[socket.id].bot.user.avatarURL({ size: 32 })
                });

            }

            // Nope
            else {
                socketUser.ids[socket.id].bot = null;
                socketUser.ids[socket.id].room = null;
                socketUser.ids[socket.id].guild = null;
                socketUser.ids[socket.id].log = null;
                fn({ success: false });
            }

        }

        // Nope
        else { fn({ success: false }); }

        // Complete
        return;

    });

    // Connected
    socket.emit('discordConnected', user);

    // Leave Guild
    socket.on('leaveDiscordGuild', function (data, fn) {

        // Check Permission
        if (socketUser.ids[socket.id].bot && socketUser.ids[socket.id].bot.user && socketUser.ids[socket.id].bot.user.id) {

            // Exist Bot
            if (socketUser.checkPerm(4, 'bot', socketUser.ids[socket.id].bot.user.id)) {

                // Is Object
                if (data && typeof data.guildID === "string" || typeof data.guildID === "number") {

                    // Leave Guild
                    const leave_guild_action = function (guildID) {
                        return new Promise(function (resolve, reject) {
                            return socketUser.ids[socket.id].bot.guilds.fetch(guildID).then(guild => {

                                // Leave the Guild
                                return guild.leave().then(() => {
                                    resolve();
                                    return;
                                }).catch(err => {
                                    reject(err);
                                    return;
                                });

                            }).catch(err => {
                                reject(err);
                                return;
                            });
                        });
                    };

                    // One Guild
                    if (data.guildID !== "all") {

                        // Leave Guild
                        leave_guild_action(data.guildID).then(() => {
                            return fn({ success: true });
                        }).catch(err => {
                            return fn({ success: false, error: err.message });
                        });

                    }

                    // All Guilds
                    else {

                        // Prepare Module
                        const forPromise = require('for-promise');
                        const guilds = Array.from(socketUser.ids[socket.id].bot.guilds.cache.keys());
                        forPromise({ data: guilds }, function (item, fn, fn_error) {

                            // Leave Guild
                            return leave_guild_action(guilds[item]).then(() => {
                                return fn();
                            }).catch(err => {
                                return fn_error(err);
                            });

                        }).then(() => {
                            return fn({ success: true });
                        }).catch(err => {
                            return fn({ success: false, error: err.message });
                        });

                    }

                }

                // Nope
                else { fn({ success: false, error: 'Invalid Guild Value!' }); }

            }

            // Nope
            else { fn({ success: false, error: 'Forbidden!' }); }

        }

        // Nope
        else { fn({ success: false, error: 'Bot Value not found!' }); }
        return;

    });

    // Get Guild Channels
    socket.on('getDiscordGuildChannels', function (guildID, fn) {

        // Exist Bot
        if (
            socketUser.ids[socket.id].bot && socketUser.ids[socket.id].bot.user && socketUser.ids[socket.id].bot.user.id &&
            socketUser.checkPerm(2, 'guild', socketUser.ids[socket.id].bot.user.id, guildID)
        ) {

            // Is Object
            if (typeof guildID === "string" || typeof guildID === "number") {

                // Get Guild Emojis
                socketUser.ids[socket.id].bot.guilds.fetch(guildID).then(guild => {

                    // Emoji List
                    const channelList = [];

                    // Moment Module
                    const moment = require('moment-timezone');

                    // Read Cache
                    guild.channels.cache.forEach(function (data) {

                        // Prepare Cache
                        const channelCache = {
                            id: data.id,
                            name: data.name,
                            type: data.type,
                            nsfw: data.nsfw,
                            parentID: data.parentID,
                            rateLimitPerUser: data.rateLimitPerUser,
                            topic: data.topic,
                            position: data.position,
                            rawPosition: data.rawPosition,
                            viewable: data.viewable,
                            deleted: data.deleted,
                            createdAt: moment(data.createdAt).format('YYYY-MM-DD')
                        };

                        // Insert Cache
                        channelList.push(channelCache);

                    });

                    // Send Result
                    fn({ success: true, result: channelList });

                    // Complete
                    return;

                }).catch(err => {
                    return fn({ success: false, error: err.message });
                });

            }

            // Nope
            else { fn({ success: false, error: 'Invalid Guild Value!' }); }

        }

        // Nope
        else { fn({ success: false, error: 'Bot Value not found!' }); }
        return;

    });

    // Get Guild Roles
    socket.on('getDiscordGuildRoles', function (guildID, fn) {

        // Exist Bot
        if (
            socketUser.ids[socket.id].bot && socketUser.ids[socket.id].bot.user && socketUser.ids[socket.id].bot.user.id &&
            socketUser.checkPerm(2, 'guild', socketUser.ids[socket.id].bot.user.id, guildID)
        ) {

            // Is Object
            if (typeof guildID === "string" || typeof guildID === "number") {

                // Get Guild Emojis
                socketUser.ids[socket.id].bot.guilds.fetch(guildID).then(guild => {

                    // Emoji List
                    const roleList = [];

                    // Moment Module
                    const moment = require('moment-timezone');

                    // Read Cache
                    guild.roles.cache.forEach(function (data) {

                        // Prepare Cache
                        const roleCache = {
                            id: data.id,
                            deleted: data.deleted,
                            color: data.color,
                            hexColor: data.hexColor,
                            name: data.name,
                            hoist: data.hoist,
                            mentionable: data.mentionable,
                            permissions: data.permissions,
                            position: data.position,
                            rawPosition: data.rawPosition,
                            createdAt: moment(data.createdAt).format('YYYY-MM-DD')
                        };

                        // Insert Cache
                        roleList.push(roleCache);

                    });

                    // Send Result
                    fn({ success: true, result: roleList });

                    // Complete
                    return;

                }).catch(err => {
                    return fn({ success: false, error: err.message });
                });

            }

            // Nope
            else { fn({ success: false, error: 'Invalid Guild Value!' }); }

        }

        // Nope
        else { fn({ success: false, error: 'Bot Value not found!' }); }
        return;

    });

    // Get Guild Emojis
    socket.on('getDiscordGuildEmojis', function (guildID, fn) {

        // Exist Bot
        if (
            socketUser.ids[socket.id].bot && socketUser.ids[socket.id].bot.user && socketUser.ids[socket.id].bot.user.id &&
            socketUser.checkPerm(2, 'guild', socketUser.ids[socket.id].bot.user.id, guildID)
        ) {

            // Is Object
            if (typeof guildID === "string" || typeof guildID === "number") {

                // Get Guild Emojis
                socketUser.ids[socket.id].bot.guilds.fetch(guildID).then(guild => {

                    // Emoji List
                    const emojiList = [];

                    // Moment Module
                    const moment = require('moment-timezone');

                    // Read Cache
                    guild.emojis.cache.forEach(function (data) {

                        // Prepare Cache
                        const emojiCache = {
                            id: data.id,
                            name: data.name,
                            animated: data.animated,
                            available: data.available,
                            deleted: data.deleted,
                            identifier: data.identifier,
                            url: data.url,
                            createdAt: moment(data.createdAt).format('YYYY-MM-DD')
                        };

                        // Exist Author
                        if (data.author) {
                            emojiCache.author = {
                                id: data.author.id,
                                tag: data.author.tag,
                                username: data.author.username,
                                discriminator: data.author.discriminator,
                            };
                        } else { emojiCache.author = null; }

                        // Insert Cache
                        emojiList.push(emojiCache);

                    });

                    // Send Result
                    fn({ success: true, result: emojiList });

                    // Complete
                    return;

                }).catch(err => {
                    return fn({ success: false, error: err.message });
                });

            }

            // Nope
            else { fn({ success: false, error: 'Invalid Guild Value!' }); }

        }

        // Nope
        else { fn({ success: false, error: 'Bot Value not found!' }); }
        return;

    });

    // Get Guild Emojis
    socket.on('getDiscordGuilds', async function (data, fn) {

        // Exist Bot
        if (socketUser.ids[socket.id].bot) {

            // Is Object
            const objType = require('@tinypudding/puddy-lib/get/objType');
            if (objType(data, 'object')) {

                // Validator
                if (objType(data.filters, 'object')) {
                    if (data.filters.members < 0) { data.filters.members = 0; }
                    if (data.filters.max_members < 0) { data.filters.max_members = 0; }
                    if (typeof data.filters.owner !== "string") { data.filters.owner = ''; }
                    if (typeof data.filters.name !== "string") { data.filters.name = ''; }
                } else { data.filters = { owner: '', name: '', members: 0, max_members: 0 }; }

                // Page
                let pager = 1;
                if (!isNaN(data.page)) {
                    pager = data.page;
                }

                // Per Page
                let perpage = 20;
                if (!isNaN(data.perpage) && data.perpage > 0 && data.perpage <= 100) {
                    perpage = data.perpage;
                }

                // Create Cache
                // Array.from(socketUser.ids[socket.id].bot.guilds.cache.keys())
                const guilds = [];
                await Promise.all(socketUser.ids[socket.id].bot.guilds.cache.map(async (guild) => {

                    // Get Guild Owner
                    let guildOwner = null;
                    if (data.filters.owner.length > 0) {
                        try { guildOwner = await guild.members.fetch(guild.ownerID); } catch (err) { guildOwner = null; }
                    }

                    // Filter
                    if (

                        // Members
                        (data.filters.members < 1 || guild.memberCount <= data.filters.members) &&

                        // Name
                        (data.filters.name.length < 1 || (
                            typeof guild.name === "string" &&
                            guild.name.toLowerCase().indexOf(data.filters.name.toLowerCase()) > -1
                        )) &&

                        // Owner
                        (!guildOwner || (

                            // Exist Nickname
                            (
                                typeof guildOwner.nickname === "string" &&
                                guildOwner.nickname.toLowerCase().indexOf(data.filters.owner.toLowerCase()) > -1
                            ) ||

                            // Exist User
                            (
                                guildOwner.user &&
                                typeof guildOwner.user.tag === "string" &&
                                guildOwner.user.tag.toLowerCase().indexOf(data.filters.owner.toLowerCase()) > -1
                            ) ||

                            // Is Same ID
                            guild.ownerID === data.filters.owner

                        ))

                    ) {

                        // Add Guild
                        guilds.push(guild);

                    }

                    // Complete
                    return;

                }));

                // Pagination
                const pagination = require('@tinypudding/puddy-lib/get/pagination');

                const paginate = require("paginate-array");
                const paginateCollection = paginate(guilds, pager, perpage);
                const navigator = pagination('page', paginateCollection.currentPage, paginateCollection.totalPages, 'javascript:void(0);', 'justify-content-center', 'my-2');

                // Data
                for (const item in paginateCollection.data) {

                    // Guild
                    const guild = paginateCollection.data[item];
                    let avatar = guild.iconURL({ size: 32 });
                    if (!avatar) { avatar = require('@tinypudding/discord-oauth2/get/randomAvatar')(); }

                    // Prepare Guild Data
                    paginateCollection.data[item] = {

                        // Icon
                        icon: avatar,

                        // Name
                        name: guild.name,

                        // ID
                        id: guild.id,

                        // Member Count
                        members: guild.memberCount,

                        // Region
                        region: guild.region,

                        // Features
                        features: guild.features

                    };

                }

                // Complete
                fn({
                    success: true,
                    pagination: navigator,
                    data: paginateCollection.data
                });

            }

            // Nope
            else { fn({ success: false, error: 'Invalid Data!' }); }

        }

        // Nope
        else { fn({ success: false, error: 'Bot Value not found!' }); }
        return;

    });

    // Connect Plugin
    if (typeof pluginSocket === "function") { pluginSocket({ socket, ioCache, io, session, web, app, socketUser, userData: socketUser.sUser }); }

};
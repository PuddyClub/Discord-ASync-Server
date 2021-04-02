module.exports = function (pluginSocket, socket, ioCache, io, session, web, app, socketUser, permLevel) {

    // Discord User Data
    const user = socketUser.data;
    socketUser.permLevel = permLevel;

    // Connect Discord Bot
    socket.on('connectDiscordBot', function (botID, fn) {

        // Is String
        if (typeof botID === "string" || typeof botID === "number") {

            // Get Bot
            const item = app.discord.bots.find(item => item.bot.user.id === botID);
            if (item) {

                // Get the Bot
                socketUser.ids[socket.id].bot = item.bot;
                socketUser.ids[socket.id].room = 'dashboard';

                // Complete
                fn({
                    success: true,
                    tag: socketUser.ids[socket.id].bot.user.tag,
                    avatar: socketUser.ids[socket.id].bot.user.avatarURL({ size: 32 })
                });

                // Connected
                socket.emit('dsBot_serverCount', socketUser.ids[socket.id].bot.guilds.cache.size);
                socket.emit('dsBot_channelCount', socketUser.ids[socket.id].bot.channels.cache.size);

                // Send Logs
                socket.emit('dsBot_error', { item: null, list: item.log.error });
                socket.emit('dsBot_warn', { item: null, list: item.log.warn });
                socket.emit('dsBot_rateLimit', { item: null, list: item.log.rateLimit });
                socket.emit('dsBot_shardError', { item: null, list: item.log.shardError });

            }

            // Nope
            else { fn({ success: false }); }

        }

        // Nope
        else { fn({ success: false }); }

        // Complete
        return;

    });

    // Connected
    socket.emit('discordConnected', user);

    // Leave Guild
    socket.on('leaveDiscordGuild', function (guildID, fn) {

        // Check Permission
        if (permLevel >= 4) {

            // Exist Bot
            if (socketUser.ids[socket.id].bot) {

                // Is Object
                if (typeof data.guildID === "string" || typeof data.guildID === "number") {

                    // Get Guild
                    socketUser.ids[socket.id].bot.guilds.fetch(guildID).then(guild => {

                        // Leave the Guild
                        return guild.leave().then(() => {
                            return fn({ success: true });
                        }).catch(err => {
                            return fn({ success: false, error: err.message });
                        });

                    }).catch(err => {
                        return fn({ success: false, error: err.message });
                    });

                }

                // Nope
                else { fn({ success: false, error: 'Invalid Guild Value!' }); }

            }

            // Nope
            else { fn({ success: false, error: 'Bot Value not found!' }); }

        }

        // Nope
        else { fn({ success: false, error: 'Forbidden!' }); }
        return;

    });

    // Get Guild Emojis
    socket.on('getDiscordGuildEmojis', function (guildID, fn) {

        // Exist Bot
        if (socketUser.ids[socket.id].bot) {

            // Is Object
            if (typeof data.guildID === "string" || typeof data.guildID === "number") {

                // Get Guild Emojis
                socketUser.ids[socket.id].bot.guilds.fetch(guildID).then(guild => {
                    fn({ success: true, result: guild.emojis.cache });
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
    socket.on('getDiscordGuilds', function (data, fn) {

        // Exist Bot
        if (socketUser.ids[socket.id].bot) {

            // Is Object
            const objType = require('@tinypudding/puddy-lib/get/objType');
            if (objType(data, 'object')) {

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

                // Pagination
                const pagination = require('@tinypudding/puddy-lib/get/pagination');

                const paginate = require("paginate-array");
                const paginateCollection = paginate(Array.from(socketUser.ids[socket.id].bot.guilds.cache.keys()), pager, perpage);
                const navigator = pagination(paginateCollection.currentPage, paginateCollection.totalPages, '/', 'justify-content-center');

                // Data
                for (const item in paginateCollection.data) {

                    // Guild
                    const guild = socketUser.ids[socket.id].bot.guilds.cache.find(guild => guild.id === paginateCollection.data[item]);;
                    
                    // Prepare Guild Data
                    paginateCollection.data[item] = {

                        // Icon
                        icon: guild.iconURL(),

                        // Name
                        name: guild.name,
                    
                        // ID
                        id: guild.id,

                        // Member Count
                        members: guild.memberCount,

                        // Region
                        region: guild.region

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
    if (typeof pluginSocket === "function") { pluginSocket({ socket, ioCache, io, session, web, app, socketUser, permLevel }); }

};
module.exports = function (socket, ioCache, io, session, web, app, soscketUser, permLevel) {

    // Discord User Data
    const user = soscketUser.data;

    // Connect Discord Bot
    socket.on('connectDiscordBot', function (botID, fn) {

        // Is String
        if (typeof botID === "string" || typeof botID === "number") {

            // Get Bot
            const item = app.discord.bots.find(item => item.bot.user.id === botID);
            if (item) {

                // Get the Bot
                soscketUser.ids[socket.id].bot = item.bot;
                soscketUser.ids[socket.id].room = 'dashboard';

                // Complete
                fn({
                    success: true,
                    tag: soscketUser.ids[socket.id].bot.user.tag,
                    avatar: soscketUser.ids[socket.id].bot.user.avatarURL({ size: 32 })
                });

                // Connected
                socket.emit('dsBot_serverCount', soscketUser.ids[socket.id].bot.guilds.cache.size);
                socket.emit('dsBot_channelCount', soscketUser.ids[socket.id].bot.channels.cache.size);

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

};
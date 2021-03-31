module.exports = function (socket, ioCache, io, session, web, app, soscketUser, permLevel) {

    // Discord User Data
    const user = soscketUser.data;

    // Disconnected
    socket.on('disconnect', (reason) => {
        console.log(reason); // "ping timeout"
    });

    // Connect Discord Bot
    socket.on('connectDiscordBot', function (botID, fn) {

        // Is String
        if (typeof botID === "string" || typeof botID === "number") {

            // Get Bot
            const item = app.discord.bots.find(item => item.bot.user.id === botID);
            if (item) {

                // Get the Bot
                soscketUser.ids[socket.id].bot = item.bot;
                fn(true);

            }

            // Nope
            else { fn(false); }

        }

        // Nope
        else { fn(false); }

        // Complete
        return;

    });

    // Connected
    socket.emit('discordConnected', user);

};
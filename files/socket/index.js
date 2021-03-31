module.exports = function (socket, ioCache, io, session, web, app, user, permLevel) {

    // Disconnected
    socket.on('disconnect', (reason) => {
        console.log(reason); // "ping timeout"
    });

    // Connect Discord Bot
    socket.on('connectDiscordBot', function(botID, fn) {

        fn('Mio!');

        // Complete
        return;

    });

    // Connected
    socket.emit('discordConnected', user);

};
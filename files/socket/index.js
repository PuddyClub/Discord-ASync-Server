module.exports = function (socket, ioCache, io, session, web, app, user, permLevel) {

    // Disconnected
    socket.on('disconnect', (reason) => {
        console.log(reason); // "ping timeout"
    });

    // Connected
    socket.emit('discordConnected', user);

};
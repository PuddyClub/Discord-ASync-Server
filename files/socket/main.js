module.exports = function (socket, ioCache, io, session, web, app, permLevel) {

    socket.on("disconnect", (reason) => {
        console.log(reason); // "ping timeout"
    });

};
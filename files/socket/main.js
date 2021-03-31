module.exports = function (socket, ioCache, io, session, web, app, user, permLevel) {

    console.log(ioCache);
    console.log(user);

    socket.on("disconnect", (reason) => {
        console.log(reason); // "ping timeout"
    });

};
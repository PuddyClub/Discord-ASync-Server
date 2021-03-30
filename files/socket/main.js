module.exports = function (socket, io, web, app) {

    socket.on("disconnect", (reason) => {
        console.log(reason); // "ping timeout"
    });

};
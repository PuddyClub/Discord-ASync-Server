module.exports = function (cmd, cfg, index) {
    return new Promise((resolve, reject) => {

        // Message
        const msg = cmd[0];
        console.log(msg);

        // Complete
        resolve();
        return;

    });
};
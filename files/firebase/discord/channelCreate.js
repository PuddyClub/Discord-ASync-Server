module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Channel
        const channel = cmd[0];

        // Guild Channel
        if (channel.type !== "dm") {

            // Exist Guild
            if (channel.guild) {

            }

        }

        // DM
        else {

        }

        // Complete
        resolve();
        return;

    });
};
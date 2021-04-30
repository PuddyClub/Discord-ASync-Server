module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Error
        const err = cmd[0];
        const shardID = cmd[1];

        // Set Event
        db.event.set({ error: { message: err.message, code: err.code }, shardID: shardID }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Data
        const err = cmd[0];
        const shardID = cmd[1];

        // Set Event
        db.event.set({ error: { message: db.escape(err.message), code: db.escape(err.code) }, shardID: db.escape(shardID) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
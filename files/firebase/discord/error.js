module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Error
        const err = cmd[0];

        // Set Event
        db.event.set({ message: db.escape(err.message), code: db.escape(err.code) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
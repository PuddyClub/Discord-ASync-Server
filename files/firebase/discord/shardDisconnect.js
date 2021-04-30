module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Error
        const event = cmd[0];
        const id = cmd[1];

        // Set Event
        db.event.set({
            id: db.escape(id), event: {
                code: db.escape(event.code),
                reason: db.escape(event.reason),
                wasClean: db.escape(event.wasClean)
            }
        }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
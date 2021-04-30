module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Error
        const event = cmd[0];
        const id = cmd[1];

        // Set Event
        db.event.set({
            id: id, event: {
                code: event.code,
                reason: event.reason,
                wasClean: event.wasClean
            }
        }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
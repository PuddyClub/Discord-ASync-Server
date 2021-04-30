module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Data
        const id = cmd[0];
        const replayedEvents = cmd[1];

        // Set Event
        db.event.set({ id: db.escape(id), replayedEvents: db.escape(replayedEvents) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
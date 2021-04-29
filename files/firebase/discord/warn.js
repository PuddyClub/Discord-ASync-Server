module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Warn
        const warn = cmd[0];

        // Set Event
        db.event.set({ warn: warn }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
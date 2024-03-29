module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Data
        const id = cmd[0];

        // Set Event
        db.event.set({ id: db.escape(id) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Error
        const id = cmd[0];

        // Set Event
        db.event.set({ id: id }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
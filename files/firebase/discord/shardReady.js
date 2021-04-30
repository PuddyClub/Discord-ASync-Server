module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Error
        const id = cmd[0];
        const unavailableGuilds = cmd[1];

        // Set Event
        db.event.set({ id: id, unavailableGuilds: unavailableGuilds }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
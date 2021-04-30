module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Data
        const id = cmd[0];
        let unavailableGuilds = cmd[1];

        // Set Event
        db.event.set({ id: db.escape(id), unavailableGuilds: db.escape(unavailableGuilds) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
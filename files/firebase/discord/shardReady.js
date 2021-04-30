module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Data
        const id = cmd[0];
        let unavailableGuilds = cmd[1];

        // Fix Value
        if (typeof unavailableGuilds === "undefined") { unavailableGuilds = null; }

        // Set Event
        db.event.set({ id: id, unavailableGuilds: unavailableGuilds }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
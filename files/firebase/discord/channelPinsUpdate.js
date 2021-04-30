module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Items
        const channel = cmd[0];
        const time = cmd[1];

        // Data
        const data = db.escape(require('./generator/channel')(channel));

        // Set Event
        db.event.set({ channel: db.escape(channel.id), time: db.escape(time) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
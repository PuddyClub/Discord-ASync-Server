module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Channel
        const channel = cmd[0];

        // Data
        const data = db.escape(require('./generator/channel')(channel));

        // Set Event
        db.event.child('channel').set(data).then(resolve).catch(reject);

        // Complete
        return;

    });
};
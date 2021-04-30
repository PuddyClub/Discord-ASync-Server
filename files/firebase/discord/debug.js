module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Set Event
        db.event.child('info').set(db.escape(cmd[0])).then(resolve).catch(reject);

        // Complete
        return;

    });
};
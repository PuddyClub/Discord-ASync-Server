module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Set Event
        const data = require('moment-timezone').utc().toObject();
        data.timezone = 'Universal';
        db.event.set(data).then(resolve).catch(reject);

        // Complete
        return;

    });
};
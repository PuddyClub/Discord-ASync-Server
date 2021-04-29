module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Rate Limit Warn
        const rateLimitInfo = cmd[0];

        // Set Event
        db.event.set({ rateLimitInfo: rateLimitInfo }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Invite
        const invite = cmd[0];

        // Data
        const inviteGenerator = require('./generator/invite');
        const data = inviteGenerator(invite);

        // Set Event
        db.event.set({ invite: data }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Guild
        const member = cmd[0];

        // Data
        const memberGenerator = require('./generator/member');
        const data = db.escape(memberGenerator(member));

        // Set Event
        db.event.set({ member: data }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
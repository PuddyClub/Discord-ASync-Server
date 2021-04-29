module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Member
        const oldMember = cmd[0];
        const newMember = cmd[1];

        // Data
        const memberGenerator = require('./generator/member');
        const oldData = memberGenerator(oldMember);
        const newData = memberGenerator(newMember);

        // Set Event
        db.event.set({oldMember: oldData, newMember: newMember.id}).then(resolve).catch(reject);

        // Complete
        return;

    });
};
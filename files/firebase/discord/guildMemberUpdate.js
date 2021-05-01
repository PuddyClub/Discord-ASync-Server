module.exports = function (cmd, db, cfg) {
    return new Promise(async (resolve, reject) => {

        // Member
        const oldMember = cmd[0];
        const newMember = cmd[1];

        // Data
        const memberGenerator = require('./generator/member');
        const oldData = db.escape(memberGenerator(oldMember));
        const newData = db.escape(memberGenerator(newMember));

        // Member ID
        const memberID = db.escape(newMember.id);

        // Guild ID
        const guildID = db.escape(newMember.guild.id);

        // Update Channel
        await db.root.child('guilds').child(guildID).child('members').child(memberID).update(newData);

        // Set Event
        db.event.set({ oldMember: oldData, newMember: db.escape(newMember.id) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
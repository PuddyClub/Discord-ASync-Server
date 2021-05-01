module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Guild
        const member = cmd[0];

        // Data
        const memberGenerator = require('./generator/member');
        const data = db.escape(memberGenerator(member));

        // Member ID
        const memberID = db.escape(member.id);

        // Guild ID
        const guildID = db.escape(member.guild.id);

        // Update Channel
        await db.root.child('guilds').child(guildID).child('members').child(memberID).set(data);

        // Set Event
        db.event.set({ member: db.escape(member.id) }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
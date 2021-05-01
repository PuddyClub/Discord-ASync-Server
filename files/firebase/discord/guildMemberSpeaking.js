module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Member
        const member = cmd[0];

        // Data
        const memberGenerator = require('./generator/member');
        const speakingGenerator = require('./generator/presence/flags');
        const data = db.escape(memberGenerator(member));
        const speaking = db.escape(speakingGenerator(cmd[1]));

        // Member ID
        const memberID = db.escape(member.id);

        // Guild ID
        const guildID = db.escape(member.guild.id);

        // Update Channel
        await db.root.child('guilds').child(guildID).child('members').child(memberID).update(data);

        // Set Event
        db.event.set({ member: db.escape(member.id), speaking: speaking }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
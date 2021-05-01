module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Data
        const oldState = cmd[0];
        const newState = cmd[1];

        // Data
        const voiceGenerator = require('./generator/voice');
        const oldData = db.escape(voiceGenerator(oldState));
        const newData = db.escape(voiceGenerator(newState));

        // Member ID
        const memberID = db.escape(newData.userID);

        // Guild ID
        const guildID = db.escape(newData.guildID);

        // Update Channel
        await db.root.child('guilds').child(guildID).child('members').child(memberID).child('voice').update(newData);

        // Set Event
        db.event.set({ newState: newData, oldState: oldData }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
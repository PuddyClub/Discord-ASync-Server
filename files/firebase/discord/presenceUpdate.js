module.exports = function (cmd, db, cfg) {
    return new Promise(async (resolve, reject) => {

        // Message
        const oldPresence = cmd[0];
        const newPresence = cmd[1];

        // Data
        const presenceGenerator = require('./generator/presence');
        const oldData = db.escape(presenceGenerator(oldPresence));
        const newData = db.escape(presenceGenerator(newPresence));

        // Member ID
        const memberID = db.escape(newData.userID);

        // Guild ID
        const guildID = db.escape(newData.guildID);

        // Update Channel
        await db.root.child('guilds').child(guildID).child('members').child(memberID).child('presence').update(newData);

        // Set Event
        db.event.set({ oldPresence: oldData, newPresence: newData }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
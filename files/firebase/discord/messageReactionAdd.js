module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Data
        const messageReaction = cmd[0];
        const user = cmd[0];

        // Data
        const reactionGenerator = require('./generator/reaction');
        const data = reactionGenerator(messageReaction);

        // Set Event
        db.event.set({ messageReaction: data, user: user.id }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
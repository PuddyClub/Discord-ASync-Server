module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Data
        const messageReaction = cmd[0];

        // Data
        const reactionGenerator = require('./generator/reaction');
        const data = db.escape(reactionGenerator(messageReaction));

        // Set Event
        db.event.set({ reaction: data }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Emoji
        const member = cmd[0];

        // Data
        const memberGenerator = require('./generator/member');
        const speakingGenerator = require('./generator/presence/flags');
        const data = memberGenerator(member);
        const speaking = speakingGenerator(cmd[1]);

        // Set Event
        db.event.set({ member: member.id, speaking: speaking }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
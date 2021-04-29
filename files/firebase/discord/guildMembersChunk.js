module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Data
        const members = cmd[0];
        const guild = cmd[1];
        const chunk = cmd[2];

        // Data
        const memberGenerator = require('./generator/member');
        const membersData = {
            ids: [],
            data: []
        };

        // Get Members
        if (members) {
            members.forEach(function (value, key) {
                membersData.ids.push(key);
                membersData.data.push(memberGenerator(value));
                return;
            });
        }

        // Set Event
        db.event.set({ members: membersData.ids, guild: guild.id, chunk: chunk }).then(resolve).catch(reject);

        // Complete
        return;

    });
};
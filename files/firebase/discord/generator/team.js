module.exports = function (team) {

    // Data
    const data = {
        createdAt: team.createdAt,
        createdTimestamp: team.createdTimestamp,
        icon: team.icon,
        id: team.id,
        name: team.name,
        ownerID: team.ownerID,
        members: [],
    };

    // Get Member ID
    if (team.members) {
        const teamMemberGenerator = require('./teamMember');
        team.members.forEach(function (value) {
            data.members.push(teamMemberGenerator(value));
            return;
        });
    }

    // Complete
    return data;

};
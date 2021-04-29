module.exports = function (memberTeam) {

    // Data
    const data = {
        id: memberTeam.id,
        membershipState: memberTeam.membershipState,
        permissions: memberTeam.permissions
    };

    // Team ID
    if (memberTeam.team && memberTeam.team.id) { data.teamID = memberTeam.team.id; }

    // User ID
    if (memberTeam.user && memberTeam.user.id) { data.userID = memberTeam.user.id; }

    // Complete
    return data;

};
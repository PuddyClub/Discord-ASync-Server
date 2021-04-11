module.exports = (app) => {
    return (userID) => {

        // Get User Values
        const index = app.users.find(user => user.id === userID);

        // Exist
        if (index) { return index; }

        // Nope
        else { return { id: String(userID), perm: 0 }; }

    };
};
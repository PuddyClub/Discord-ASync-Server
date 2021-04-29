module.exports = function (mentions) {
    if (mentions) {

        // Data
        const data = {
            everyone: mentions.everyone,
            roles: [],
            members: [],
            channels: []
        };

        // Get Channels
        if (mentions.channels) {
            mentions.channels.forEach(function (value, key) {
                data.channels.push(key);
                return;
            });
        }

        if (mentions.crosspostedChannels) {
            mentions.crosspostedChannels.forEach(function (value) {
                data.crosspostedChannels.push(value);
                return;
            });
        }
        
        // Members
        if (mentions.members) {
            mentions.members.forEach(function (value, key) {
                data.members.push(key);
                return;
            });
        }

        // Roles
        if (mentions.roles) {
            mentions.roles.forEach(function (value, key) {
                data.roles.push(key);
                return;
            });
        }

        // Complete
        return data;

    } else { return null; }
};
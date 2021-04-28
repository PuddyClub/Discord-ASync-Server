module.exports = function (channel) {

    // Data
    const data = {
        createdAt: channel.createdAt,
        createdTimestamp: channel.createdTimestamp,
        deleted: channel.deleted,
        id: channel.id,
        name: channel.name,
        type: channel.type,
        typing: channel.typing,
        typingCount: channel.typingCount,
    };

    // Exist Guild 
    if (channel.guild) {

        // Insert Data
        data.guildID = channel.guild.id;
        data.deletable = channel.deletable;
        data.parentID = channel.parentID;
        data.manageable = channel.manageable;
        data.permissionOverwrites = channel.permissionOverwrites;
        data.permissionsLocked = channel.permissionsLocked;
        data.position = channel.position;
        data.rawPosition = channel.rawPosition;
        data.viewable = channel.viewable;
        data.members = [];

        // Get Members ID
        if (channel.members) {
            channel.members.forEach(function (value, key) {
                data.members.push(key);
                return;
            });
        }

    }

    // Nope
    else {
        data.partial = channel.partial;
        data.recipientID = channel.recipient.id;
    }

    // Last Message ID
    if (channel.lastMessageID) { data.lastMessageID = channel.lastMessageID; }
    if (channel.lastPinAt) { data.lastPinAt = channel.lastPinAt; }
    if (channel.lastPinTimestamp) { data.lastPinTimestamp = channel.lastPinTimestamp; }

    // Complete
    return data;

};
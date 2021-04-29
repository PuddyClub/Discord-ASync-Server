module.exports = function (invite) {
    if (invite) {

        // Data
        const data = {
            code: invite.code,
            createdAt: invite.createdAt,
            createdTimestamp: invite.createdTimestamp,
            deletable: invite.deletable,
            expiresAt: invite.expiresAt,
            expiresTimestamp: invite.expiresTimestamp,
            maxAge: invite.maxAge,
            maxUses: invite.maxUses,
            memberCount: invite.memberCount,
            presenceCount: invite.presenceCount,
            targetUserType: invite.targetUserType,
            temporary: invite.temporary,
            url: invite.url,
            uses: invite.uses
        };

        // Channel ID
        if (invite.channel && invite.channel.id) { data.channelID = invite.channel.id; }

        // Guild ID
        if (invite.guild && invite.guild.id) { data.guildID = invite.guild.id; }

        // Inviter ID
        if (invite.inviter && invite.inviter.id) { data.inviterID = invite.inviter.id; }

        // Target User ID
        if (invite.targetUser && invite.targetUser.id) { data.targetUserID = invite.targetUser.id; }

        // Complete
        return data;

    } else { return null; }
};
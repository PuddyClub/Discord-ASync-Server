module.exports = function (voice) {
    if (voice) {

        // Data
        const data = {
            channelID: voice.channelID,
            deaf: voice.deaf,
            id: voice.id,
            mute: voice.mute,
            selfDeaf: voice.selfDeaf,
            selfMute: voice.selfMute,
            selfVideo: voice.selfVideo,
            serverDeaf: voice.serverDeaf,
            serverMute: voice.serverMute,
            sessionID: voice.sessionID,
            speaking: voice.speaking,
            streaming: voice.streaming
        };

        // User ID
        if (voice.member) { data.userID = voice.member.id; }

        // Guild ID
        if (voice.guild) { data.guildID = voice.guild.id; }

        // Complete
        return data;

    } else { return null; }
};
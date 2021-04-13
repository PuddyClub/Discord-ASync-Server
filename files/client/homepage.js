// Start Values
var socket = null;
var firstTime = true;
var dsUser = null;
var bot = { id: null, log: {} };
var startApp = function (isReconnect) { };
var startBot = function (id, isReconnect) { };
var startGuild = function (id, isReconnect) { };
var receiveLog = function (type, isNew, data) { };

$(() => {

    // Connection
    { { connection } }

    // Connection
    { { select_bot } }

    // Tools Script
    { { tools_script } }

    // Server List Script
    { { server_list_script } }

    // Log Update Script
    { { log_update_script } }

    // Guild Data
    socket.on('dsBot_guildMemberCount', (count) => { $('#guild_info_table #members_count #info').text(count); });
    socket.on('dsBot_guildEmojiCount', (count) => { $('#guild_info_table #emoji_count #info > a').text(count); });
    socket.on('dsBot_guildRoleCount', (count) => { $('#guild_info_table #role_count #info > a').text(count); });
    socket.on('dsBot_guildRegion', (count) => { $('#guild_info_table #server_region #info').text(count); });
    socket.on('dsBot_guildName', (count) => { $('#guild_info_table #server_name #info').text(count); });
    socket.on('dsBot_guildChannelsCount', (count) => { $('#guild_info_table #channel_count #info > a').text(count); });
    socket.on('dsBot_guildCreationDate', (count) => { $('#guild_info_table #creation_date #info').text(count); });

    socket.on('dsBot_guildOwner', (user) => {
        $('#guild_info_table #guild_owner_name #info').empty().append(
            $('<span>').text(user.tag), ' ', $('<small>').text(user.id)
        );
    });

    socket.on('refreshPage', () => { location.reload(); });
    socket.on("disconnect", () => {
        $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)", text: tinyLang.reconnecting });
    });

});
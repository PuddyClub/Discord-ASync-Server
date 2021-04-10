// Start Values
var socket = null;
var firstTime = true;
var dsUser = null;
var bot = { id: null, log: {} };
var startApp = function (isReconnect) {

};

$(() => {

    // Socket Connection
    socket = io.connect();

    $("html").fadeIn();
    $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });

    // Connected
    socket.on('discordConnected', user => {

        // First Time
        if (firstTime) { firstTime = false; $.LoadingOverlay('hide'); $('.bot_list').fadeIn(); startApp(false); }

        // Nope
        else {

            // Exist Bot Selected
            if (bot.id) {
                socket.emit('connectDiscordBot', bot.id, (data) => {

                    // Success
                    if (data.success) {

                        // Set Bot Name
                        $('#ds_bot_' + bot.id + ' > span > span').text(data.tag);
                        $('#ds_bot_' + bot.id + ' > span > img').attr('src', data.avatar);

                        // Exist Guild Selected
                        if (bot.guild) {
                            socket.emit('connectDiscordGuild', bot.guild, () => {

                                // Complete
                                $.LoadingOverlay("hide"); startApp(true);

                            });
                        }

                        // Nope
                        else { $.LoadingOverlay("hide"); startApp(true); }

                    }

                    // Nope
                    else {

                        // End Load
                        $.LoadingOverlay("hide");

                        // Select Server Button
                        $("#select_server").removeClass('disabled');

                        // Set Message
                        $('#app').empty().append(
                            $('<center>').text(tinyLang.botNotFound)
                        );

                        // Start Plugins
                        startApp(true);

                    }

                });
            }

            // Nope
            else { $.LoadingOverlay("hide"); startApp(true); }

        }

        // User
        dsUser = user;

    });

    // Select Bot
    $('[id^="ds_bot_"]').click(function () {

        // Get Bot ID
        $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });
        const botID = $(this).attr('id').substring(7);
        socket.emit('connectDiscordBot', botID, (data) => {

            // Is Active
            if (data.success && (typeof bot.id !== "string" || botID !== bot.id)) {

                // Select Server Button
                bot.guild = null;
                $("#select_server").removeClass('disabled');

                // Change Option
                $('#ds_bot_' + botID).parent().addClass('active').css('pointer-events', 'none');
                $('#ds_bot_' + botID + ' > span > span').text(data.tag);
                $('#ds_bot_' + botID + ' > span > img').attr('src', data.avatar);
                $('#ds_bot_' + bot.id).parent().removeClass('active').css('pointer-events', '');

                // Rest App Place
                $('#panel_title').text(tinyLang.dashboard);
                $('.config-list').removeClass('active');
                $('#dashboard.config-list').addClass('active');
                $('#app').empty().append(

                    // Statics
                    $('<div>', { id: 'statistical_table', class: 'row' }).append(

                        // Bot Name
                        toolsCreator.cardRow('ID', botID, 'fas fa-robot').attr('id', 'bot_id'),

                        // Servers
                        toolsCreator.cardRow('Servers', '???', 'fas fa-server', 'info').attr('id', 'server_count'),

                        // Channels
                        toolsCreator.cardRow('Channels', '???', 'fas fa-th-list', 'info').attr('id', 'channel_count')

                    )

                );

                // Set new ID
                bot.id = botID;

            }

            // Complete
            $.LoadingOverlay('hide');
            return;

        });

    });

    // Tools Script
    { { tools_script } }

    // Server List Script
    { { server_list_script } }

    // Log Update Script
    { { log_update_script } }

    // Update Info
    socket.on('dsBot_serverCount', (count) => { $('#server_count #info').text(count); });
    socket.on('dsBot_channelCount', (count) => { $('#channel_count #info').text(count); });

    // Guild Data
    socket.on('dsBot_guildMemberCount', (count) => { $('# #info').text(count); });
    socket.on('dsBot_guildEmojiCount', (count) => { $('# #info').text(count); });
    socket.on('dsBot_guildRoleCount', (count) => { $('# #info').text(count); });


    socket.on("disconnect", () => {
        $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)", text: tinyLang.reconnecting });
    });

});
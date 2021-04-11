// Start Values
var socket = null;
var firstTime = true;
var dsUser = null;
var bot = { id: null, log: {} };
var startApp = function (isReconnect) { };
var startBot = function (id, isReconnect) { };
var startGuild = function (id, isReconnect) { };

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
                        startBot(bot.id, true);

                        // Exist Guild Selected
                        if (bot.guild) {
                            socket.emit('connectDiscordGuild', bot.guild, (data) => {

                                // Complete
                                if (data.success) { startGuild(bot.guild, true); }
                                $.LoadingOverlay("hide"); startApp(true);

                                // Update Page Data
                                socket.emit('updateCountPage', 'connectDiscordGuild');

                            });
                        }

                        // Nope
                        else { bot.guild = null; $.LoadingOverlay("hide"); startApp(true); }

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
                        bot.id = null;
                        bot.guild = null;
                        startApp(true);

                    }

                });
            }

            // Nope
            else { $.LoadingOverlay("hide"); startApp(true); }
            socket.emit('updateCountPage', 'discordConnected');

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

                    $('<h4>').text('Bot'),

                    // Statics
                    $('<div>', { id: 'statistical_table', class: 'row' }).append(

                        // Bot ID
                        toolsCreator.cardRow(tinyLang.id, botID, 'fas fa-robot', 'primary').attr('id', 'bot_id'),

                        // Servers
                        toolsCreator.cardRow(tinyLang.servers, '???', 'fas fa-server', 'info').attr('id', 'server_count'),

                        // Channels
                        toolsCreator.cardRow(tinyLang.channels, '???', 'fas fa-th-list', 'info', 'col-xl-4 col-lg-12 col-md-12 mb-4').attr('id', 'channel_count')

                    ),

                    $('<hr/>'),

                    $('<h4>').text('Server'),

                    // Guild
                    $('<div>', { id: 'guild_info_table', class: 'row', style: 'display: none;' }).append(

                        // Server ID
                        toolsCreator.cardRow(tinyLang.id, '???', 'fas fa-id-card-alt', 'primary').attr('id', 'server_id'),

                        // Region
                        toolsCreator.cardRow(tinyLang.region, '???', 'fas fa-globe-americas', 'info').attr('id', 'server_region'),

                        // Server Name
                        toolsCreator.cardRow(tinyLang.name, '???', 'fas fa-font', 'info').attr('id', 'server_name'),

                        // Emojis
                        toolsCreator.cardRow(tinyLang.emojis, '???', 'far fa-laugh-beam', 'info').attr('id', 'emoji_count'),

                        // Roles
                        toolsCreator.cardRow(tinyLang.roles, '???', 'fas fa-flag', 'info').attr('id', 'role_count'),

                        // Channels
                        toolsCreator.cardRow(tinyLang.channels, '???', 'fas fa-th-large', 'info').attr('id', 'channel_count'),

                        // Members
                        toolsCreator.cardRow(tinyLang.members, '???', 'fas fa-users', 'info', 'col-xl-6 col-md-6 col-lg-6 mb-4').attr('id', 'members_count'),

                        // Creation Date
                        toolsCreator.cardRow(tinyLang.creation_date, '???', 'fas fa-calendar', 'info', 'col-xl-6 col-md-6 col-lg-6 mb-4').attr('id', 'creation_date')

                    )

                );

                // Set new ID
                bot.id = botID;
                startBot(bot.id, false);

            }

            // Update Page Data
            socket.emit('updateCountPage', 'connectDiscordBot');

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

    // Guild Data
    socket.on('dsBot_guildMemberCount', (count) => { $('#guild_info_table #members_count #info').text(count); });
    socket.on('dsBot_guildEmojiCount', (count) => { $('#guild_info_table #emoji_count #info').text(count); });
    socket.on('dsBot_guildRoleCount', (count) => { $('#guild_info_table #role_count #info').text(count); });

    socket.on('refreshPage', () => { location.reload(); });
    socket.on("disconnect", () => {
        $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)", text: tinyLang.reconnecting });
    });

});
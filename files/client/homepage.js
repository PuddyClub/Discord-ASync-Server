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
                        toolsCreator.cardRow(tinyLang.emojis, $('<a>', { href: 'javascript:void(0);' }).text('???').click(function () {

                            socket.emit('getDiscordGuildEmojis', bot.guild, (data) => {

                                // Success
                                if (data.success) {

                                    // Prepare Body
                                    const body = [];
                                    const downloadList = [];

                                    // Read Result
                                    for (const item in data.result) {

                                        // Button
                                        const downloadButton = tinyLib.button(tinyLang.download, 'secondary', { href: data.result[item].url },).click(function () {
                                            download($(this).attr('href'));
                                            return false;
                                        });

                                        // List
                                        downloadList.push(downloadButton);

                                        // Create TR
                                        body.push({

                                            // TD
                                            items: [

                                                // Icon
                                                {
                                                    item: $('<img>', { alt: `${data.result[item].id}_icon`, src: data.result[item].url, height: 32, style: 'height: 32px;' }),
                                                    isText: false
                                                },

                                                // Name
                                                {
                                                    item: $('<span>').append(
                                                        $('<div>').text(data.result[item].name),
                                                        $('<small>').text(data.result[item].id),
                                                    ),
                                                    isText: false
                                                },

                                                // Actions
                                                {
                                                    item: [downloadButton],
                                                    isText: false
                                                },

                                            ]

                                        });

                                    }

                                    // Modal
                                    tinyLib.modal({
                                        dialog: 'modal-lg',
                                        id: 'server-list-modal',
                                        title: tinyLang.emojis,
                                        body: tinyLib.table({

                                            // Info
                                            id: 'emojis_list',
                                            class: 'table-striped',
                                            responsive: true,

                                            // Head
                                            thead:
                                            {
                                                items: [

                                                    // TDs
                                                    {
                                                        items: [

                                                            // Icon
                                                            {
                                                                isText: true,
                                                                item: tinyLang.icon
                                                            },

                                                            // Name
                                                            {
                                                                isText: true,
                                                                item: tinyLang.name
                                                            },

                                                            // Actions
                                                            {
                                                                isText: true,
                                                                item: tinyLang.actions
                                                            }

                                                        ]
                                                    }

                                                ]
                                            },

                                            // Body
                                            tbody: { items: body }

                                        }),
                                        footer: [

                                            // Download All
                                            tinyLib.button(tinyLang.close, 'primary').text(tinyLang.download_all).click(function () {

                                                // Prepare ZIP
                                                const zip = new JSZip();
                                                const fileURLs = [];
                                                for (const item in downloadList) {
                                                    fileURLs.push(downloadList[item].attr('href'));
                                                }

                                                // Insert ZIP Files

                                                // Start Download
                                                download(zip.generate({type:"blob"}), bot.guild + '.zip', 'application/zip');

                                            }),

                                            // Close
                                            tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })

                                        ],
                                    });

                                }

                                // Fail
                                else {

                                    // Fail Error Message
                                    tinyLib.modal({
                                        dialog: 'modal-lg',
                                        id: 'server-list-modal-error',
                                        title: 'Error!',
                                        body: data.error,
                                        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
                                    });

                                }

                            });

                            // Complete
                            return false;

                        }), 'far fa-laugh-beam', 'info').attr('id', 'emoji_count'),

                        // Roles
                        toolsCreator.cardRow(tinyLang.roles, $('<a>', { href: 'javascript:void(0);' }).text('???').click(function () {


                            // Complete
                            return false;

                        }), 'fas fa-flag', 'info').attr('id', 'role_count'),

                        // Channels
                        toolsCreator.cardRow(tinyLang.channels, $('<a>', { href: 'javascript:void(0);' }).text('???').click(function () {


                            // Complete
                            return false;

                        }), 'fas fa-th-large', 'info').attr('id', 'channel_count'),

                        // Guild Owner
                        toolsCreator.cardRow(tinyLang.guild_owner, '???', 'fas fa-user-tie', 'info').attr('id', 'guild_owner_name'),

                        // Members
                        toolsCreator.cardRow(tinyLang.members, '???', 'fas fa-users', 'info').attr('id', 'members_count'),

                        // Creation Date
                        toolsCreator.cardRow(tinyLang.creation_date, '???', 'fas fa-calendar', 'info').attr('id', 'creation_date')

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
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

                $('<h4>').text('Server').append($('<small>', { id: 'server-selected-features' })),

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
                            { { get_emojis } }
                        });

                        // Complete
                        return false;

                    }), 'far fa-laugh-beam', 'info').attr('id', 'emoji_count'),

                    // Roles
                    toolsCreator.cardRow(tinyLang.roles, $('<a>', { href: 'javascript:void(0);' }).text('???').click(function () {

                        $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });
                        socket.emit('getDiscordGuildRoles', bot.guild, (data) => {
                            { { get_roles } }
                        });

                        // Complete
                        return false;

                    }), 'fas fa-flag', 'info').attr('id', 'role_count'),

                    // Channels
                    toolsCreator.cardRow(tinyLang.channels, $('<a>', { href: 'javascript:void(0);' }).text('???').click(function () {

                        $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });
                        socket.emit('getDiscordGuildChannels', bot.guild, (data) => {
                            { { get_channels } }
                        });

                        // Complete
                        return false;

                    }), 'fas fa-th-list', 'info').attr('id', 'channel_count'),

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
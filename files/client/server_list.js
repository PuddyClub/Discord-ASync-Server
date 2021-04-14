// Select Server Page System
const pageSystem = { page: 1, perpage: 50, menuOn: false, filters: { owner: '', name: '', members: 0 } };

// Open Server
const openServer = (data, isCount, isSelected) => {

    // Complete
    if (data.success) {

        // Change ID Number
        $('#guild_info_table #server_id #info').text(bot.guild);
        $('#guild_info_table').fadeIn();

        // Is Selected
        if (isSelected) {

            // Complete
            startGuild(bot.guild, false);

        }

    }

    // Error
    else {

        // Fail Error Message
        $('#guild_info_table').fadeOut();
        tinyLib.modal({
            dialog: 'modal-lg',
            id: 'server-list-modal',
            title: 'Error!',
            body: data.errorGetGuild,
            footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
        });

    }

    // Update Page Data
    if (!isCount) { socket.emit('updateCountPage', 'openServer'); }

};

// Research Server
const researchServers = function (isServerCount) {

    // Start Loading
    $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });

    // Go to Page
    socket.emit('getDiscordGuilds', pageSystem, (data) => {

        // Complete
        $.LoadingOverlay("hide");

        // Success
        if (data.success) {
            const resultData = getPage(data);
            $('#server-list-modal .modal-body').empty()
                .append(resultData.leaveAllServers, resultData.pagination, resultData.serverList, resultData.pagination.clone());
        }

        // Fail
        else {

            // Fail Error Message
            tinyLib.modal({
                dialog: 'modal-lg',
                id: 'server-list-modal',
                title: 'Error!',
                body: data.error,
                footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
            });

        }

        // Update Page Data
        if (!isServerCount) { socket.emit('updateCountPage', 'getDiscordGuilds'); }

    });

};

// Select Server

// Get Page
const getPage = function (data) {

    // Get Pagination
    const pagination = tinyLib.paginationCreator(data.pagination, function () {

        // Page
        const page = Number($(this).attr('page'));
        pageSystem.page = page;
        researchServers();

    });

    // Server List
    const servers = [];
    if (data.data.length > 0) {
        for (const item in data.data) {

            // Create TR
            servers.push({

                // TD
                items: [

                    // Icon
                    {
                        item: $('<img>', { alt: `${data.data[item].id}_icon`, src: data.data[item].icon, height: 32, style: 'height: 32px;' }),
                        isText: false
                    },

                    // Name
                    {
                        item: $('<span>').append(
                            $('<div>').text(data.data[item].name).prepend(toolsCreator.featuresIcon(data.data[item].features, 'mr-2')),
                            $('<small>').text(data.data[item].id),
                        ),
                        isText: false
                    },

                    // Region
                    {
                        item: data.data[item].region,
                        isText: true
                    },

                    // Members
                    {
                        item: data.data[item].members,
                        isText: true
                    },

                    // Actions
                    {
                        item: [

                            // Select Server
                            tinyLib.button(tinyLang.select_server, 'secondary mx-1', { 'data-dismiss': 'modal', id: 'ds_bot_guild_' + data.data[item].id }).click(function () {

                                // Guild ID
                                $(this).addClass('disabled');
                                const guildID = $(this).attr('id').substring(13);

                                // Connect Guild
                                bot.guild = guildID;
                                socket.emit('connectDiscordGuild', guildID, function (data) {
                                    return openServer(data, false, true);
                                });

                            }),

                            // Remove Server
                            tinyLib.button(tinyLang.leave, 'danger mx-1', { 'data-dismiss': 'modal', id: 'ds_bot_guild_' + data.data[item].id }).click(function () {

                                // Guild ID
                                $(this).addClass('disabled');
                                const guildID = $(this).attr('id').substring(13);

                                // Modal
                                tinyLib.modal({
                                    dialog: 'modal-lg',
                                    id: 'delete-confirm',
                                    title: $('<span>').text(tinyLang.leave),
                                    body: tinyLang.confirm_leave,
                                    footer: [
                                        tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' }),
                                        tinyLib.button(tinyLang.confirm, 'danger', { 'data-dismiss': 'modal' }).click(function () {

                                            $(this).addClass('disabled');
                                            socket.emit('leaveDiscordGuild', { guildID: guildID }, function (data) {

                                                // Success
                                                if (data.success) {

                                                    // Modal
                                                    tinyLib.modal({
                                                        dialog: 'modal-lg',
                                                        id: 'delete-confirm-success',
                                                        title: $('<span>').text(tinyLang.leave),
                                                        body: tinyLang.guild_deleted,
                                                        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })],
                                                        hidden: function () {
                                                            return $('#ds_bot_' + bot.id).trigger('click');
                                                        }
                                                    });

                                                }

                                                // Fail
                                                else {

                                                    // Fail Error Message
                                                    tinyLib.modal({
                                                        dialog: 'modal-lg',
                                                        id: 'delete-all-confirm-error',
                                                        title: 'Error!',
                                                        body: data.error,
                                                        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
                                                    });

                                                }

                                            });

                                        }),
                                    ]
                                });

                            })
                        ],
                        isText: false
                    },

                ]

            });

        }

    }

    else { pageSystem.page = 1; }

    // Leave All Servers
    const leaveAllServers = tinyLib.button([tinyLib.fontAwesome('fa-trash', 'fas'), $('<span>', { class: 'ml-2' }).text(tinyLang.leave_all)], 'danger', { 'data-dismiss': 'modal' }).click(function () {

        // Modal
        $(this).addClass('disabled');
        tinyLib.modal({
            dialog: 'modal-lg',
            id: 'delete-all-confirm-1',
            title: [$('<i>', { class: 'fas fa-exclamation-triangle mr-2' }), $('<span>').text(tinyLang.leave_all)],
            body: tinyLang.confirm_leave_all,
            footer: [
                tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' }),
                tinyLib.button(tinyLang.confirm, 'danger', { 'data-dismiss': 'modal' }).click(function () {

                    // Modal
                    $(this).addClass('disabled');
                    tinyLib.modal({
                        dialog: 'modal-lg',
                        id: 'delete-all-confirm-2',
                        title: [$('<i>', { class: 'fas fa-exclamation-triangle mr-2' }), $('<span>').text(tinyLang.leave_all)],
                        body: tinyLang.confirm_leave_all_1,
                        footer: [
                            tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' }),
                            tinyLib.button(tinyLang.confirm, 'danger', { 'data-dismiss': 'modal' }).click(function () {

                                // Modal
                                $(this).addClass('disabled');
                                tinyLib.modal({
                                    dialog: 'modal-lg',
                                    id: 'delete-all-confirm-3',
                                    title: [$('<i>', { class: 'fas fa-radiation-alt mr-2' }), $('<span>').text(tinyLang.leave_all)],
                                    body: tinyLang.confirm_leave_all_2,
                                    footer: [
                                        tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' }),
                                        tinyLib.button(tinyLang.confirm, 'danger', { 'data-dismiss': 'modal' }).click(function () {

                                            $(this).addClass('disabled');
                                            socket.emit('leaveDiscordGuild', { guildID: 'all' }, function (data) {

                                                // Success
                                                if (data.success) {

                                                    // Modal
                                                    tinyLib.modal({
                                                        dialog: 'modal-lg',
                                                        id: 'delete-all-confirm-success',
                                                        title: [$('<i>', { class: 'fas fa-radiation-alt mr-2' }), $('<span>').text(tinyLang.leave_all)],
                                                        body: tinyLang.guilds_deleted,
                                                        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })],
                                                        hidden: function () {
                                                            return $('#ds_bot_' + bot.id).trigger('click');
                                                        }
                                                    });

                                                }

                                                // Fail
                                                else {

                                                    // Fail Error Message
                                                    tinyLib.modal({
                                                        dialog: 'modal-lg',
                                                        id: 'delete-all-confirm-error',
                                                        title: 'Error!',
                                                        body: data.error,
                                                        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
                                                    });

                                                }

                                            });

                                        }),
                                    ]
                                });

                            }),
                        ]
                    });

                }),
            ]
        });

        socket.emit('connectDiscordGuild', guildID, function (data) {
            return openServer(data, false, true);
        });

    });

    // Server List
    const serverList = tinyLib.table({

        // Info
        id: 'servers',
        class: 'table-hover table-striped',
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

                        // Region
                        {
                            isText: true,
                            item: tinyLang.region
                        },

                        // Members
                        {
                            isText: true,
                            item: tinyLang.members
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
        tbody: { items: servers }

    });

    // Complete
    return {

        // Leave All Servers
        leaveAllServers: leaveAllServers,

        // Create Table
        serverList: serverList,

        // Pagination
        pagination: pagination

    };

};

// Select Server Button
$('#select_server').click(function () {

    // Page System
    $(this).addClass('disabled');
    pageSystem.menuOn = true;
    $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });
    socket.emit('getDiscordGuilds', pageSystem, (data) => {

        // Complete
        $.LoadingOverlay("hide");
        $(this).removeClass('disabled');

        // Success
        if (data.success) {

            // Result Page
            const resultData = getPage(data);

            // Prepare Search Form
            const searchForm = tinyLib.collapseItem('searchServersForm', {

                // Config
                type: 'button',
                config: { class: 'btn btn-secondary mr-2' },
                html: [tinyLib.fontAwesome('fa-search', 'fas'), $('<span>', { class: 'ml-2' }).text(tinyLang.search)],

                // Form
                item: $('<form>', { id: 'server-list-search' }).append(

                    $('<div>', { class: 'row' }).append(

                        // Owner
                        $('<div>', { class: 'col-xl-4 col-md-6 mb-4' }).append(tinyLib.formGroup('owner', {
                            label: $('<span>').text(tinyLang.owner),
                            input: 'text',
                            value: pageSystem.filters.owner
                        })),

                        // Name
                        $('<div>', { class: 'col-xl-4 col-md-6 mb-4' }).append(tinyLib.formGroup('name', {
                            label: $('<span>').text(tinyLang.name),
                            input: 'text',
                            value: pageSystem.filters.name
                        })),

                        // Members
                        $('<div>', { class: 'col-xl-4 col-md-12 mb-4' }).append(tinyLib.formGroup('members', {
                            label: $('<span>').text(tinyLang.min_members),
                            input: 'number',
                            min: 0,
                            value: pageSystem.filters.members
                        })),

                    ),

                    // Submit
                    $('<hr/>'),
                    $('<center>', { class: 'mb-2' }).append(tinyLib.button(tinyLang.search, 'secondary', { type: 'submit' }))

                ).submit(function (e) {

                    // Prevent Default
                    e.preventDefault();

                    // Values
                    let owner = $('#server-list-search #formGroupBase_owner > input').val();
                    let name = $('#server-list-search #formGroupBase_name > input').val();
                    let members = Number($('#server-list-search #formGroupBase_members > input').val());

                    // Validator
                    if (members < Number($('#server-list-search #formGroupBase_members > input').attr('min'))) { members = 0; }
                    if (typeof owner !== "string") { owner = ''; }
                    if (typeof name !== "string") { name = ''; }

                    // Install Values
                    pageSystem.filters.owner = owner;
                    pageSystem.filters.name = name;
                    pageSystem.filters.members = members;

                    // Block Submit HTML
                    $('#server-list-modal').modal('hide');
                    $('#select_server').trigger('click');
                    return false;

                })

            });

            // Modal
            tinyLib.modal({
                dialog: 'modal-lg',
                id: 'server-list-modal',
                title: tinyLang.server_list,
                body: [

                    // Search Tools
                    searchForm.item,
                    $('<center>').append(searchForm.button, resultData.leaveAllServers),

                    // Server Manager
                    resultData.pagination,
                    resultData.serverList,
                    resultData.pagination.clone()

                ],
                footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })],
                hidden: function () { pageSystem.menuOn = false; }
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

});

// Socket Auto Update Server List
socket.on('dsBot_channelCount', (count) => { $('#statistical_table #channel_count #info').text(count); });
socket.on('dsBot_serverCount', (item) => {

    // Update Number
    $('#statistical_table #server_count #info').text(item.value);

    // Update Server List
    if ($('#server-list-modal').length > 0) { researchServers(true); }

    // Check Exist Server
    if (bot.guild) {
        socket.emit('connectDiscordGuild', bot.guild, function (data) {
            return openServer(data, item.isCount);
        });
    }

});
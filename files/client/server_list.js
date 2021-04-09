// Select Server Page System
const pageSystem = { page: 1, perpage: 50, menuOn: false };

// Research Server
const researchServers = function () {

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
                        $('<div>').text(data.data[item].name),
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
                        tinyLib.button(tinyLang.select_server, 'secondary mx-1', { 'data-dismiss': 'modal' }),
                        tinyLib.button(tinyLang.leave, 'danger mx-1', { 'data-dismiss': 'modal' })
                    ],
                    isText: false
                },

            ]

        });

    }

    // Leave All Servers
    const leaveAllServers = $('<center>').append(tinyLib.button(tinyLang.leave_all, 'danger', { 'data-dismiss': 'modal' }));

    // Server List
    const serverList = tinyLib.table({

        // Info
        id: 'servers',
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
    pageSystem.page = 1;
    pageSystem.menuOn = true;
    $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });
    socket.emit('getDiscordGuilds', pageSystem, (data) => {

        // Complete
        $.LoadingOverlay("hide");

        // Success
        if (data.success) {

            const resultData = getPage(data);

            // Modal
            tinyLib.modal({
                dialog: 'modal-lg',
                id: 'server-list-modal',
                title: tinyLang.server_list,
                body: [resultData.leaveAllServers, resultData.pagination, resultData.serverList, resultData.pagination.clone()],
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
socket.on('dsBot_serverCount', (count) => {

    // Update Number
    $('#server_count #info').text(count);

    // Update Server List
    if ($('#server-list-modal').length > 0) { researchServers(); }

    // Exist #server-list-modal

});
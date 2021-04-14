
// Remove Loading
$.LoadingOverlay("hide");

// Success
if (data.success) {

    // Items Order
    const itemsOrder = ['news', 'store', 'text', 'dm', 'voice', 'unknown'];

    // Prepare Groups
    const groups = [{ id: 0, position: -1, items: {} }];
    for (const item in data.result) {
        if (data.result[item].type !== "category") {

            // Category Item
            let category;

            // Exist Category
            if (data.result[item].parentID) {

                // Exist Category
                category = groups.find(group => group.id === data.result[item].parentID);
                if (!category) {

                    // Create Category
                    category = data.result.find(group => group.id === data.result[item].parentID);
                    delete category.type;
                    groups.push(category);

                }

            }

            // Nope
            else { category = groups.find(group => group.id === 0); }

            // Insert Into Category
            if (!category.items) { category.items = {}; }
            if (!Array.isArray(category.items[data.result[item].type])) { category.items[data.result[item].type] = []; }
            category.items[data.result[item].type].push(data.result[item]);
            delete data.result[item].parentID;
            delete data.result[item].type;

        }
    }

    // Sort Groups
    const sortPositions = function (a, b) { return a.position < b.position ? -1 : a.position > b.position ? 1 : 0; };
    groups.sort(sortPositions);

    // Main Table

    // Prepare Body
    const body = [];

    // Read Categories
    for (const item in groups) {

        // Fix Channels
        for (const group in groups[item].items) {
            groups[item].items[group].sort(sortPositions);
        }

        // Is Visible
        let isVisible;
        if (groups[item].viewable) {
            isVisible = tinyLib.fontAwesome('fa-eye', 'fas').attr('title', tinyLang.viewable).tooltip();
        }

        // Nope
        else {
            isVisible = tinyLib.fontAwesome('fa-eye-slash', 'fas').attr('title', tinyLang.not_viewable).tooltip();
        }

        // Is Deleted
        let isDeleted;
        if (groups[item].deleted) {
            isDeleted = tinyLib.fontAwesome('fa-trash', 'fas').addClass('ml-2').attr('title', tinyLang.deleted).tooltip();
        }

        // New Item
        const newItem = { items: [] };

        // Categories
        if (item > 0) {
            newItem.items.push({
                item: $('<span>').append(
                    $('<div>').text(groups[item].name).append(isVisible.addClass('ml-2'), isDeleted),
                    $('<small>').text(groups[item].id),
                ),
                isText: false
            });
        }

        // No Category
        else {
            newItem.items.push({
                item: tinyLang.no_category,
                isText: true
            });
        }

        // Prepare Items
        const items = [];

        // Read Channels
        for (const ctype in itemsOrder) {
            if (groups[item].items[itemsOrder[ctype]]) {

                // Get Channel Data
                const body = [];
                for (const citem in groups[item].items[itemsOrder[ctype]]) {

                    // New Item
                    const newItem = { items: [] };

                    // Item
                    const channel = groups[item].items[itemsOrder[ctype]][citem];
                    console.log(channel);

                    // Is Visible
                    let isVisible;
                    if (channel.viewable) {
                        isVisible = tinyLib.fontAwesome('fa-eye', 'fas').attr('title', tinyLang.viewable).tooltip();
                    }

                    // Nope
                    else {
                        isVisible = tinyLib.fontAwesome('fa-eye-slash', 'fas').attr('title', tinyLang.not_viewable).tooltip();
                    }

                    // Is NSFW
                    let isNSFW;
                    if (channel.nsfw) {
                        isNSFW = tinyLib.fontAwesome('fa-fire', 'fas').addClass('ml-2').attr('title', tinyLang.nsfw).tooltip();
                    }

                    // Is Deleted
                    let isDeleted;
                    if (channel.deleted) {
                        isDeleted = tinyLib.fontAwesome('fa-trash', 'fas').addClass('ml-2').attr('title', tinyLang.deleted).tooltip();
                    }

                    // Add Item
                    newItem.items.push({
                        item: $('<span>').append(
                            $('<div>').text(channel.name)
                                .append(isVisible.addClass('ml-2'), isNSFW, isDeleted),
                            $('<small>').text(channel.id),
                        ),
                        isText: false
                    });

                    // Add to Body
                    body.push(newItem);

                }

                // Icons
                let typeChannelIcon;
                if (itemsOrder[ctype] === 'news') { typeChannelIcon = tinyLib.fontAwesome('fa-bullhorn', 'fas'); }
                else if (itemsOrder[ctype] === 'store') { typeChannelIcon = tinyLib.fontAwesome('fa-store', 'fas'); }
                else if (itemsOrder[ctype] === 'text') { typeChannelIcon = tinyLib.fontAwesome('fa-hashtag', 'fas'); }
                else if (itemsOrder[ctype] === 'dm') { typeChannelIcon = tinyLib.fontAwesome('fa-envelope', 'fas'); }
                else if (itemsOrder[ctype] === 'voice') { typeChannelIcon = tinyLib.fontAwesome('fa-volume-up', 'fas'); }
                else { typeChannelIcon = tinyLib.fontAwesome('fa-question-circle', 'fas'); }

                // Add Item Type
                items.push($('<h5>').text(tinyLang[itemsOrder[ctype]]).prepend(typeChannelIcon.addClass('mr-2')));

                // Create Table of Channel Type
                items.push(tinyLib.table({

                    // Info
                    id: 'channels_items_' + itemsOrder[ctype] + '_list',
                    class: 'table-striped',
                    responsive: true,

                    // Head
                    thead:
                    {
                        items: [

                            // TDs
                            {
                                items: [

                                    // Nmme
                                    {
                                        isText: true,
                                        item: tinyLang.name
                                    },

                                    // Created At
                                    {
                                        isText: true,
                                        item: tinyLang.topic
                                    },

                                    // Created At
                                    {
                                        isText: true,
                                        item: tinyLang.creation_date
                                    }

                                ]
                            }

                        ]
                    },

                    // Body
                    tbody: { items: body }

                }));

            }
        }

        // Add Items
        newItem.items.push({
            item: items,
            isText: false
        });

        // Add Body
        body.push(newItem);

    }

    // Create Table
    const mainTable = tinyLib.table({

        // Info
        id: 'channels_list',
        class: 'table-striped',
        responsive: true,

        // Head
        thead:
        {
            items: [

                // TDs
                {
                    items: [

                        // Info
                        {
                            isText: true,
                            item: tinyLang.info
                        },

                        // Items
                        {
                            isText: true,
                            item: tinyLang.channels
                        }

                    ]
                }

            ]
        },

        // Body
        tbody: { items: body }

    });

    // Modal
    tinyLib.modal({
        dialog: 'modal-lg',
        id: 'channel-list',
        title: tinyLang.channels,
        body: mainTable,
        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
    });

    $('#channel-list .modal-lg').css('max-width', '95%');
    $('#channel-list').css('background-color', 'rgba(0,0,0,0.8)');

}

// Fail
else {

    // Fail Error Message
    tinyLib.modal({
        dialog: 'modal-lg',
        id: 'channel-list-error',
        title: 'Error!',
        body: data.error,
        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
    });

}

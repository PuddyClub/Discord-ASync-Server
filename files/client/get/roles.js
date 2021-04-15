
// Remove Loading
$.LoadingOverlay("hide");

// Success
if (data.success) {

    // Prepare Body
    const body = [];

    // Sort Result
    data.result.sort(sortPositionsReverse);

    // Read Data
    for (const item in data.result) {

        // New Item
        const newItem = { items: [] };

        // Is Deleted
        let isDeleted;
        if (data.result[item].deleted) {
            isDeleted = tinyLib.fontAwesome('fa-trash', 'fas').addClass('ml-2').attr('title', tinyLang.deleted).tooltip();
        }

        // Is Mentionable
        let isMentionable;
        if (data.result[item].mentionable) {
            isMentionable = tinyLib.fontAwesome('fa-quote-right', 'fas').addClass('ml-2').attr('title', tinyLang.mentionable).tooltip();
        }

        // Is Hoist
        let isHoist;
        if (data.result[item].hoist) {
            isHoist = tinyLib.fontAwesome('fa-user-tag', 'fas').addClass('ml-2').attr('title', tinyLang.hoist).tooltip();
        }

        // Role Color
        const roleColor = tinyLib.fontAwesome('fa-circle', 'fas').css({ color: data.result[item].hexColor, cursor: 'pointer' }).attr('title', data.result[item].hexColor).attr('data-clipboard-text', data.result[item].hexColor).addClass('ml-2')
            .mouseenter(function () {
                $(this).css('filter', 'brightness(110%)');
            })
            .click(function () {
                $(this).css('filter', 'brightness(130%)');
                const tinyThis = this;
                setTimeout(function () { $(tinyThis).css('filter', ''); }, 500)
            })
            .mouseleave(function () {
                $(this).css('filter', '');
            }).tooltip();

        // Add Name
        newItem.items.push({
            item: $('<span>').append(
                $('<div>').text(data.result[item].name)
                    .append(roleColor, isMentionable, isHoist, isDeleted),
                $('<small>').text(data.result[item].id),
            ),
            isText: false
        });

        // Add Created At Date
        newItem.items.push({
            item: data.result[item].createdAt,
            isText: true
        });

        // Add to Body
        body.push(newItem);

    }

    // Modal
    tinyLib.modal({
        dialog: 'modal-lg',
        id: 'role-list',
        title: tinyLang.roles,
        body: tinyLib.table({

            // Info
            id: 'roles_list',
            class: 'table-hover table-bordered',
            responsive: true,

            // Head
            thead:
            {
                items: [

                    // TDs
                    {
                        items: [

                            // Name
                            {
                                isText: true,
                                item: tinyLang.name
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

        }),
        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
    });

    var clipboard = new ClipboardJS('.fa-circle');

    clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });

}

// Fail
else {

    // Fail Error Message
    tinyLib.modal({
        dialog: 'modal-lg',
        id: 'role-list-error',
        title: 'Error!',
        body: data.error,
        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
    });

}


// Remove Loading
$.LoadingOverlay("hide");

// Success
if (data.success) {

    // Prepare Body
    const body = [];

    // Read Data
    for (const item in data.result) {

        console.log(data.result[item]);

        // New Item
        const newItem = { items: [] };

        // Is Deleted
        let isDeleted;
        if (data.result[item].deleted) {
            isDeleted = tinyLib.fontAwesome('fa-trash', 'fas').addClass('ml-2').attr('title', tinyLang.deleted).tooltip();
        }

        // Add Name
        newItem.items.push({
            item: $('<span>').append(
                $('<div>').text(data.result[item].name)
                    .append(isDeleted),
                $('<small>').text(data.result[item].id),
            ),
            isText: false
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
        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
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

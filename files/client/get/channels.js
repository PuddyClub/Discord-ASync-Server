
// Remove Loading
$.LoadingOverlay("hide");

// Success
if (data.success) {

    // Prepare Body
    const body = [];

    console.log(data);

    // Modal
    tinyLib.modal({
        dialog: 'modal-lg',
        id: 'channel-list',
        title: tinyLang.channels,
        body: tinyLib.table({

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
        id: 'channel-list-error',
        title: 'Error!',
        body: data.error,
        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
    });

}


// Remove Loading
$.LoadingOverlay("hide");

// Success
if (data.success) {

    // Prepare Body
    const body = [];

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
    const sortPositions = function (a, b) {
        return a.position < b.position ? -1 : a.position > b.position ? 1 : 0;
    };

    groups.sort(sortPositions);
    for (const item in groups) {
        for (const group in groups[item].items) {
            groups[item].items[group].sort(sortPositions);
        }
    }

    console.log(groups);

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

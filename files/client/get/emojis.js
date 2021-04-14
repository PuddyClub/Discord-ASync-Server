
// Success
if (data.success) {

    // Prepare Body
    const body = [];
    const downloadList = [];

    // Read Result
    for (const item in data.result) {

        // Button
        const downloadButton = tinyLib.button(tinyLang.download, 'secondary', { href: data.result[item].url, name: data.result[item].name }).click(function () {
            $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });
            const emojiName = $(this).attr('name');
            const emojiURL = $(this).attr('href');
            JSZipUtils.getBinaryContent(emojiURL, function (err, data) {

                // End
                $.LoadingOverlay('hide');

                // Error
                if (err) {
                    tinyLib.modal({
                        dialog: 'modal-lg',
                        id: 'emoji-download-list-error',
                        title: 'Error!',
                        body: err.message,
                        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
                    });
                }

                // Nope 
                else {
                    const fe = emojiURL.split('.').pop();
                    download(data, emojiName + '.' + fe, 'image/' + fe);
                }

            });
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
        id: 'emoji-download-list',
        title: tinyLang.emojis,
        body: tinyLib.table({

            // Info
            id: 'emojis_list',
            class: 'table-hover table-bordered',
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
                    fileURLs.push({ href: downloadList[item].attr('href'), name: downloadList[item].attr('name') });
                }

                // Insert ZIP Files
                $.LoadingOverlay("show", { background: "rgba(0,0,0, 0.5)" });
                forPromise({ data: fileURLs }, function (item, fn, fn_error) {

                    return JSZipUtils.getBinaryContent(fileURLs[item].href, function (err, data) {

                        // Error
                        if (err) {
                            fn_error(err); // or handle the error
                        }

                        // Nope 
                        else {

                            const fe = fileURLs[item].href.split('.').pop();
                            zip.file(fileURLs[item].name + '.' + fe, data, { binary: true });
                            fn();

                        }

                    });

                }).then(async () => {

                    // Start Download
                    const file = await zip.generateAsync({ type: "blob" });
                    download(file, 'guild_emojis_' + bot.guild + '.zip', 'application/zip');
                    $.LoadingOverlay('hide');
                    return;

                }).catch(err => {

                    // Fail Error Message
                    $.LoadingOverlay('hide');
                    tinyLib.modal({
                        dialog: 'modal-lg',
                        id: 'emoji-download-list-error',
                        title: 'Error!',
                        body: err.message,
                        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
                    });

                });

                return;

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
        id: 'emoji-download-list-error',
        title: 'Error!',
        body: data.error,
        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
    });

}

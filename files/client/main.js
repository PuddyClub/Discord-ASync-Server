tinyLib.dialog = function (data1, data2) {

    const newData = $('<div>', {
        id: data1.id,
        title: data1.title
    }).append(data1.html);

    $("body").append(newData);
    newData.dialog(data2);

};


tinyLib.alert = function (where, alertType, icon, text) {
    $(where)
        .empty()
        .append($("<div>", {
            class: "alert alert-" + alertType + " alert-dismissible fade show"
        }).append(
            $("<button>", { class: "close", "data-dismiss": "alert", type: "button" }).append(
                $("<span>", { "aria-hidden": true, class: "text-secondary" }).text("×")
            ),
            $("<i>", { class: icon }), " ", text)
        );
};

tinyLib.button = function (text = '???', type = 'primary', extra) {

    // Button Config
    const buttonConfig = { class: 'btn btn-' + type, type: 'button' };

    // Extra
    if (extra) { for (const item in extra) { buttonConfig[item] = extra[item]; } }

    // Result
    return $('<button>', buttonConfig).text(text);

};

tinyLib.table = function (data) {

    // Rest Creation
    const createTheTable = function () {

        // Table Base
        const tableBase = $('<table>', { class: 'table ' + data.class, id: data.id });

        // Thead
        const thead = $('<thead>', data.thead.options);
        for (const tr in data.thead.items) {

            // TR
            const tr = $('<tr>', data.thead.items[tr].options);
            for (const item in data.thead.items[tr].items) {

                // Text
                if (data.thead.items[tr].items[item].isText) {
                    tr.append($('<th>', data.thead.items[tr].items[item].options).text(data.thead.items[tr].items[item].item))
                }

                // Item
                else {
                    tr.append($('<th>', data.thead.items[tr].items[item].options).append(data.thead.items[tr].items[item].item))
                }

            }

            // Insert Item
            thead.append(tr);
        }

        // Body
        const tbody = $('<tbody>', data.tbody.options);
        for (const tr in data.tbody.items) {

            // TR
            const tr = $('<tr>', data.tbody.items[tr].options);
            for (const item in data.tbody.items[tr].items) {

                // Is TH
                let type = 'td';
                if (data.tbody.items[tr].items[item].th) { type = 'th'; }

                // Text
                if (data.tbody.items[tr].items[item].isText) {
                    tr.append($('<' + type + '>', data.tbody.items[tr].items[item].options).text(data.tbody.items[tr].items[item].item));
                }

                // Item
                else {
                    tr.append($('<' + type + '>', data.tbody.items[tr].items[item].options).append(data.tbody.items[tr].items[item].item));
                }

            }

            // Insert Item
            tbody.append(tr);
        }

        // Result
        return tableBase.append(thead, tbody);

    };

    // Responsive
    if (data.responsive) {
        return $('<div>', { class: 'table-responsive' }).append(createTheTable());
    } else {
        return createTheTable();
    }

};

tinyLib.modal = function (data) {

    const modal = $("<div>", { class: "modal fade", id: data.id, tabindex: -1, role: "dialog", }).on('hidden.bs.modal', function (e) {
        $(this).remove();
        if (typeof data.hidden === "function") {
            data.hidden();
        }
    }).append(
        $("<div>", { class: "modal-dialog " + data.dialog, role: "document" }).append(
            $("<div>", { class: "modal-content" }).append(

                $("<div>", { class: "modal-header" }).append(
                    $("<h5>", { class: "modal-title" }).text(data.title),
                    $("<button>", { type: "button", class: "close", "data-dismiss": "modal" }).append(
                        $("<span>").text("×")
                    )
                ),

                $("<div>", { class: "modal-body" }).append(data.body),
                $("<div>", { class: "modal-footer" }).append(data.footer)

            )
        )
    );

    $("body").prepend(modal);

    if (data.config) {
        modal.modal(data.config);
    } else {
        modal.modal();
    }

};
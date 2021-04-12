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

tinyLib.button = function (text = '???', type = 'primary', extra, isURL = false) {

    // Button Config
    const buttonConfig = { class: 'btn btn-' + type, type: 'button' };

    // Extra
    if (extra) { for (const item in extra) { buttonConfig[item] = extra[item]; } }

    // Result
    if (!isURL) { return $('<button>', buttonConfig).text(text); } else { return $('<a>', buttonConfig).text(text); }


};

tinyLib.paginationCreator = function (pagination, callback = null) {

    // Items Navigator
    const next = [];
    const previous = [];
    if (pagination.pages > 1) {

        // Previous
        if (pagination.firstPagination) {
            previous.push($('<li>', { class: 'page-item' }).append(
                $('<a>', { class: 'page-link', href: pagination.url + '1', 'aria-label': 'Previous', page: 1 }).click(callback).append(
                    $('<span>', { 'aria-hidden': true }).text('««'),
                    $('<span>', { class: 'sr-only' }).text('Previous')
                )
            ));
        }

        if (pagination.previous) {
            previous.push($('<li>', { class: 'page-item' }).append(
                $('<a>', { class: 'page-link', href: pagination.url + String(Number(pagination.page) - 1), 'aria-label': 'Previous', page: Number(pagination.page) - 1 }).click(callback).append(
                    $('<span>', { 'aria-hidden': true }).text('«'),
                    $('<span>', { class: 'sr-only' }).text('Previous')
                )
            ));
        }

        // Next
        if (pagination.lastPagination) {
            next.push($('<li>', { class: 'page-item' }).append(
                $('<a>', { class: 'page-link', href: pagination.url + pagination.pages, 'aria-label': 'Next', page: pagination.pages }).click(callback).append(
                    $('<span>', { 'aria-hidden': true }).text('»»'),
                    $('<span>', { class: 'sr-only' }).text('Next')
                )
            ));
        }

        if (pagination.next) {
            next.push($('<li>', { class: 'page-item' }).append(
                $('<a>', { class: 'page-link', href: pagination.url + String(Number(pagination.page) + 1), 'aria-label': 'Next', page: Number(pagination.page) + 1 }).click(callback).append(
                    $('<span>', { 'aria-hidden': true }).text('»'),
                    $('<span>', { class: 'sr-only' }).text('Next')
                )
            ));
        }

    }

    // Items
    const items = [];
    for (const item in pagination.pagination) {

        if (pagination.pagination[item] !== pagination.page) {
            items.push($('<li>', { class: 'page-item' }).append(
                $('<a>', { class: 'page-link', href: pagination.url + String(pagination.pagination[item]), page: pagination.pagination[item] }).click(callback).text(pagination.pagination[item])
            ));
        } else {
            items.push($('<li>', { class: 'page-item' }).append(
                $('<a>', { class: 'page-link active' }).text(pagination.pagination[item])
            ));
        }

    }

    // Complete
    return $('<nav>', { class: pagination.extraClass2 }).append(
        $('<ul>', { class: 'pagination m-0 ' + pagination.extraClass }).append(
            previous, items, next
        )
    );

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
            const trItem = $('<tr>', data.thead.items[tr].options);
            for (const item in data.thead.items[tr].items) {

                // Text
                if (data.thead.items[tr].items[item].isText) {
                    trItem.append($('<th>', data.thead.items[tr].items[item].options).text(data.thead.items[tr].items[item].item))
                }

                // Item
                else {
                    trItem.append($('<th>', data.thead.items[tr].items[item].options).append(data.thead.items[tr].items[item].item))
                }

            }

            // Insert Item
            thead.append(trItem);
        }

        // Body
        const tbody = $('<tbody>', data.tbody.options);
        for (const tr in data.tbody.items) {

            // TR
            const trItem = $('<tr>', data.tbody.items[tr].options);
            for (const item in data.tbody.items[tr].items) {

                // Is TH
                let type = 'td';
                if (data.tbody.items[tr].items[item].th) { type = 'th'; }

                // Text
                if (data.tbody.items[tr].items[item].isText) {
                    trItem.append($('<' + type + '>', data.tbody.items[tr].items[item].options).text(data.tbody.items[tr].items[item].item));
                }

                // Item
                else {
                    trItem.append($('<' + type + '>', data.tbody.items[tr].items[item].options).append(data.tbody.items[tr].items[item].item));
                }

            }

            // Insert Item
            tbody.append(trItem);

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
                    $("<h5>", { class: "modal-title" }).append(data.title),
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

tinyLib.capitalize = function (text) {
    return text.replace(/\b\w/g, function (l) { return l.toUpperCase() });
};

tinyLib.formGroup = function (id, data) {

    // Items
    const result = [];
    let formName = 'form-group';

    // Normal Input
    if (data.input !== "checkbox" && data.input !== "radio") {

        // Label
        if (data.label) {
            result.push($('<label>', { for: 'exampleInput' + tinyLib.capitalize(id) }).append(data.label));
        };

        // Default Type
        if (typeof data.input !== "string") { data.input = 'text'; }

        // Insert Input
        const insertInput = function (data, isReturn = false) {

            // Input
            let input;

            // Input
            if (data.input !== "textarea" && data.input !== "select" && data.input !== "range") {

                // Class Item
                let classItem = 'form-control';
                if (!data.class.contains('form-control-plaintext')) {
                    classItem += ' ' + data.class;
                } else {
                    classItem = data.class;
                }

                // Input Text
                input = $('<input>', { placeholder: data.placeholder, type: data.input, class: classItem, id: 'exampleInput' + tinyLib.capitalize(id), 'aria-describedby': id + 'Help' }).prop('readonly', data.readonly).val(data.value);

            }

            // Range
            else if (data.input === "range") {
                input = $('<input>', { type: 'range', min: data.min, max: data.max, step: data.step, class: 'form-control-range ' + data.class, id: 'exampleInput' + tinyLib.capitalize(id), 'aria-describedby': id + 'Help' }).prop('readonly', data.readonly).val(data.value);
            }

            // Textarea
            else if (data.input === "textarea") {
                input = $('<textarea>', { rows: data.rows, class: 'form-control ' + data.class, id: 'exampleInput' + tinyLib.capitalize(id), 'aria-describedby': id + 'Help' }).prop('readonly', data.readonly).text(data.value);
            }

            // Select
            else if (data.input === "select") {

                // Options List
                const options = [];
                for (const item in data.options) {
                    options.push($('<option>', { value: data.options[item].value, class: data.options[item].class }).prop('selected', data.options[item].selected).text(data.options[item].name));
                }

                // Insert Result
                input = $('<select>', { class: 'form-control ' + data.class, id: 'exampleInput' + tinyLib.capitalize(id), 'aria-describedby': id + 'Help' }).prop('multiple', data.multiple).prop('readonly', data.readonly).append(options).val(data.value);

            }

            // Return Data
            if (!isReturn) { result.push(input); return; } else { return input; }

        };

        // Nope Group
        if (!Array.isArray(data.group)) { insertInput(data); }

        // Group
        else {

            // Base
            const groupBase = $('<div>', { class: 'input-group ' + data.class });

            // Get Group Values
            for (const item in data.group) {

                // Get Input
                let input = null;

                // Normal
                if (data.group[item].input) {
                    input = insertInput(data.group[item].input, true);
                }

                // Group Item
                else if (typeof data.group[item].text !== "undefined") {
                    input = $('<div>', { class: 'input-group-' + data.group[item].class }).append(
                        $('<div>', { class: 'input-group-text' }).append(data.group[item].text)
                    );
                }

                // Insert Input
                groupBase.append(input);

            }

            // Group Base
            result.push(groupBase);

        }

    }

    // Checkbox
    else {

        // Name
        formName += ' form-check';

        // Inline
        if (data.inline) { formName += ' form-check-inline'; }

        // Input
        result.push($('<input>', { name: data.name, type: checkbox, class: 'form-check-input ' + data.class, id: 'exampleCheck' + tinyLib.capitalize(id), 'aria-describedby': id + 'Help' }).prop('checked', data.checked));

        // Label
        if (data.label) {
            result.push($('<label>', { for: 'exampleCheck' + tinyLib.capitalize(id) }).append(data.label));
        };

    }

    // Help
    if (data.help) {
        result.push($('<small>', { id: id + 'Help' }).append(data.help));
    };

    // Result
    return $('<div>', { class: formName, id: 'formGroupBase_' + id }).append(result);

};
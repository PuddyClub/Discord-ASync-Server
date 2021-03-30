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
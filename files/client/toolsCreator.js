// Tools Creator
const toolsCreator = {

    // Card Row
    cardRow: function (title = 'Example', info = '???', icon = 'fas fa-question', color = 'primary', size = 'col-xl-4 col-md-6 mb-4') {

        // Info Place
        let infoPlace;
        if (typeof info === "string") { infoPlace = $('<div>', { class: 'h5 mb-0 font-weight-bold text-gray-800', id: 'info' }).text(info); }
        else { infoPlace = $('<div>', { class: 'h5 mb-0 font-weight-bold text-gray-800', id: 'info' }).append(info); }

        // Result
        return $('<div>', { class: size }).append(
            $('<div>', { class: 'card border-left-' + color + ' shadow h-100 py-2' }).append(
                $('<div>', { class: 'card-body' }).append(
                    $('<div>', { class: 'row no-gutters align-items-center' }).append(

                        // Data
                        $('<div>', { class: 'col mr-2' }).append(

                            // Title
                            $('<div>', { class: 'text-xs font-weight-bold text-' + color + ' text-uppercase mb-1', id: 'title' }).text(title),

                            // Info
                            infoPlace

                        ),

                        // Icon
                        $('<div>', { class: 'col-auto' }).append($('<i>', { class: icon + ' fa-2x text-gray-300', id: 'icon' }))

                    )
                )
            )
        )

    }

};
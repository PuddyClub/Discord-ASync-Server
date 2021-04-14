// Tools Creator
const toolsCreator = {

    // Features Icons
    featuresIcon: function (features) {

        // Result
        const result = [];

        // Read Features List
        if (Array.isArray(features)) {
            for (const item in features) {
                if (typeof features[item] === "string") {

                    // Convert Item
                    features[item] = features[item].toUpperCase();

                    // Commerce
                    if (features[item] === 'COMMERCE') {
                        result.push(tinyLib.fontAwesome('fa-store', 'fas').attr('title', tinyLang.commerce).addClass('mr-2'));
                    }

                    // Commerce
                    if (features[item] === 'COMMUNITY') {
                        result.push(tinyLib.fontAwesome('fa-users', 'fas').attr('title', tinyLang.community).addClass('mr-2'));
                    }

                    // Commerce
                    if (features[item] === 'DISCOVERABLE') {
                        result.push(tinyLib.fontAwesome('fa-globe', 'fas').attr('title', tinyLang.discoverable).addClass('mr-2'));
                    }

                    // Commerce
                    if (features[item] === 'NEWS') {
                        result.push(tinyLib.fontAwesome('fa-bullhorn', 'fas').attr('title', tinyLang.news).addClass('mr-2'));
                    }

                    // Commerce
                    if (features[item] === 'PARTNERED') {
                        result.push(tinyLib.fontAwesome('fa-infinity', 'fas').attr('title', tinyLang.partnered).addClass('mr-2'));
                    }

                    // Commerce
                    if (features[item] === 'VERIFIED') {
                        result.push(tinyLib.fontAwesome('fa-certificate', 'fas').attr('title', tinyLang.verified).addClass('mr-2'));
                    }

                    // Commerce
                    if (features[item] === 'VIP_REGIONS') {
                        result.push(tinyLib.fontAwesome('fa-star', 'fas').attr('title', tinyLang.vip_regions).addClass('mr-2'));
                    }

                }
            }
        }

        // Complete
        return result;

    },

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
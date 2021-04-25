// Cache
website.memoryCache = { usedMem: [], freeMem: [], totalMem: [], time: [], timeORIGINAL: [], now: null, logUsing: null, logCanvas: null, chart: null };

// Get Memory Cacjr
const getMemoryCacheValue = function (items) {

    // Get Values
    for (const item in items) {
        if (typeof items[item] === "number") {
            items[item];
        }
    }

    // Complete
    return;

};

// Update Chart JS
const updateMemoryCacheData = function () {

    // Exist Log
    if (website.memoryCache.logUsing) {

        // Create Canvas
        if (!website.memoryCache.chart) {

            // Show Total Memory
            let showTotalMemory = true;
            if (website.memoryCache.logUsing === "totalMemory") { showTotalMemory = false; }

            // Labels
            const labels = [];
            for (let i = 0; i < website.memoryCache.totalMem.length; i++) {
                labels.push('');
            }

            // Color Opacity
            const colorOpacity = {
                usedMemory: 0.4,
                freeMemory: 0.4,
                totalMem: 0.4
            };

            const borderOpacity = {
                usedMemory: 1,
                freeMemory: 1,
                totalMem: 1
            };

            colorOpacity[website.memoryCache.logUsing] = 0.7;
            borderOpacity[website.memoryCache.logUsing] = 3;

            // Fix Values
            getMemoryCacheValue(website.memoryCache.totalMem);
            getMemoryCacheValue(website.memoryCache.freeMem);
            getMemoryCacheValue(website.memoryCache.usedMem);

            // Create Chart
            const ctx = website.memoryCache.logCanvas[0].getContext('2d');
            website.memoryCache.chart = new Chart(ctx, {
                responsive: true,
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [

                        // Total Memory
                        {
                            hidden: showTotalMemory,
                            label: tinyLang.total_memory,
                            data: website.memoryCache.totalMem,
                            backgroundColor: [
                                'rgba(54, 162, 235, ' + colorOpacity.totalMemory + ')'
                            ],
                            borderColor: [
                                'rgba(54, 162, 235, 1)'
                            ],
                            borderWidth: borderOpacity.totalMem
                        },

                        // Free Memory
                        {
                            label: tinyLang.free_memory,
                            data: website.memoryCache.freeMem,
                            backgroundColor: [
                                'rgba(97, 255, 123, ' + colorOpacity.freeMemory + ')'
                            ],
                            borderColor: [
                                'rgba(132, 255, 66, 1)'
                            ],
                            borderWidth: borderOpacity.freeMemory
                        },

                        // Used Memory
                        {
                            label: tinyLang.used_memory,
                            data: website.memoryCache.usedMem,
                            backgroundColor: [
                                'rgba(255, 99, 132, ' + colorOpacity.usedMemory + ')'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: borderOpacity.usedMemory
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

        }

        // Update
        else {

            // Update Now
            website.memoryCache.chart.update();

        }

    }

    // Complete
    return console.log(website.memoryCache);

};

// Open History
$('[id="openHistoryLog"]').click(function () {

    // Get ID
    const id = $(this).find('span').attr('id');
    website.memoryCache.logUsing = id;
    website.memoryCache.logCanvas = $('<canvas>').css({ height: '50%', width: '90%' });

    // Protection Click
    $('[id="openHistoryLog"]').css('pointer-events', 'none');
    setTimeout(function () { $('[id="openHistoryLog"]').css('pointer-events', ''); }, 500);

    // Modal
    tinyLib.modal({
        dialog: 'modal-lg',
        id: id + '-log-panel',
        title: tinyLang[id + '_history_title'],
        body: $('<center>').append(website.memoryCache.logCanvas),
        hidden: function () {
            website.memoryCache.chart.destroy();
            website.memoryCache.logCanvas.remove();
            website.memoryCache.logUsing = null;
            website.memoryCache.logCanvas = null;
            website.memoryCache.chart = null;
            return;
        },
        footer: [tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })]
    });

    // Auto Update
    updateMemoryCacheData();

});

// Memory Server
socket.on("machineMemory", (data) => {

    // Update Page
    $("#usedMemory").text(data.usedMem.value);
    $("#freeMemory").text(data.freeMem.value);
    $("#totalMemory").text(data.totalMem.value);
    $('[id="openHistoryLog"]').removeClass('disabled');

    // Update Values
    website.memoryCache.now = moment(data.time);
    if (Array.isArray(data.history.usedMem)) { website.memoryCache.usedMem = data.history.usedMem; }
    if (Array.isArray(data.history.freeMem)) { website.memoryCache.freeMem = data.history.freeMem; }
    if (Array.isArray(data.history.totalMem)) { website.memoryCache.totalMem = data.history.totalMem; }

    // Insert Time
    if (Array.isArray(data.history.time)) {

        // Insert Values
        for (const item in data.history.time) {
            if (!website.memoryCache.time[item] || website.memoryCache.timeORIGINAL[item] !== data.history.time[item]) {
                website.memoryCache.time.push(moment(data.history.time));
            }
        }

        // Insert New Original
        website.memoryCache.timeORIGINAL = data.history.time;

    }

    // Complete
    return updateMemoryCacheData();

});

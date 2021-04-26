// Cache
website.memoryCache = {
    firstTime: false,
    n: { usedMem: [], freeMem: [], totalMem: [] },
    t: { usedMem: [], freeMem: [], totalMem: [] },
    time: { data: [], original: [], now: null },
    chart: { data: null, canvas: null, modal: null, paused: false }
};

// Update Chart JS
const updateMemoryCacheData = function () {

    // Exist Log
    if (website.memoryCache.chart.modal) {

        // Create Canvas
        if (!website.memoryCache.chart.data) {

            // Show Total Memory
            let showTotalMemory = true;
            if (website.memoryCache.chart.modal === "totalMemory") { showTotalMemory = false; }

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

            colorOpacity[website.memoryCache.chart.modal] = 0.7;
            borderOpacity[website.memoryCache.chart.modal] = 3;

            // Create Chart
            const ctx = website.memoryCache.chart.canvas[0].getContext('2d');
            website.memoryCache.chart.data = new Chart(ctx, {

                // Config
                responsive: true,
                type: 'line',


                // Options
                options: {

                    // Scales
                    scales: {
                        y: { beginAtZero: true },
                        xAxes: [{
                            display: false //this will remove all the x-axis grid lines
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                callback: function (value) {
                                    return humanFileSize(value);
                                }
                            }
                        }]
                    },

                    tooltips: {
                        callbacks: {
                            label: function (c) {

                                // Start Search
                                const label = website.memoryCache.chart.data.data.datasets[c.datasetIndex].label;
                                let searchResult;
                                let resultIs = null;

                                searchResult = website.memoryCache.n.totalMem.find(item => item === c.yLabel);
                                if (searchResult) {
                                    resultIs = 'totalMem';
                                } else {
                                    searchResult = website.memoryCache.n.freeMem.find(item => item === c.yLabel);
                                    if (searchResult) {
                                        resultIs = 'freeMem';
                                    } else {
                                        searchResult = website.memoryCache.n.usedMem.find(item => item === c.yLabel);
                                        if (searchResult) {
                                            resultIs = 'usedMem';
                                        }
                                    }
                                }

                                // Found
                                if (searchResult && typeof website.memoryCache.t[resultIs][c.index] === "string") {
                                    return label + ' ' + website.memoryCache.t[resultIs][c.index];
                                }

                                // Nothing
                                else { return '???'; }

                            },
                            title: function (c) {
                                return website.memoryCache.time.data[c[0].index];
                            }
                        }
                    }

                },

                // Data
                data: {
                    labels: website.memoryCache.time.data,
                    datasets: [

                        // Total Memory
                        {
                            hidden: showTotalMemory,
                            label: tinyLang.total_memory,
                            data: website.memoryCache.n.totalMem,
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
                            data: website.memoryCache.n.freeMem,
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
                            data: website.memoryCache.n.usedMem,
                            backgroundColor: [
                                'rgba(255, 99, 132, ' + colorOpacity.usedMemory + ')'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: borderOpacity.usedMemory
                        }
                    ]
                }

            });

        }

        // Update
        else {

            // Read Datasets
            const used_memory = website.memoryCache.chart.data.data.datasets.find(dataset => dataset.label === tinyLang.used_memory);
            if (used_memory) { used_memory.data = website.memoryCache.n.usedMem; }
            const freeMemory = website.memoryCache.chart.data.data.datasets.find(dataset => dataset.label === tinyLang.free_memory);
            if (freeMemory) { freeMemory.data = website.memoryCache.n.freeMem; }
            const totalMem = website.memoryCache.chart.data.data.datasets.find(dataset => dataset.label === tinyLang.total_memory);
            if (totalMem) { totalMem.data = website.memoryCache.n.totalMem; }

            // Update Now
            if (!website.memoryCache.chart.paused) { website.memoryCache.chart.data.update(); }

        }

    }

    // Complete
    return;

};

// Open History
$('[id="openHistoryLog"]').click(function () {

    // Get ID
    const id = $(this).find('span').attr('id');
    website.memoryCache.chart.modal = id;
    website.memoryCache.chart.canvas = $('<canvas>').css({ height: '50%', width: '90%' });

    // Protection Click
    $('[id="openHistoryLog"]').css('pointer-events', 'none');
    setTimeout(function () { $('[id="openHistoryLog"]').css('pointer-events', ''); }, 500);

    // Button Pause Message
    let buttonPauseMessage = '';
    if (website.memoryCache.chart.paused) { buttonPauseMessage = tinyLang.resume; } else {
        buttonPauseMessage = tinyLang.pause;
    }

    // Modal
    tinyLib.modal({
        dialog: 'modal-lg',
        id: id + '-log-panel',
        title: tinyLang[id + '_history_title'],
        body: $('<center>').append(website.memoryCache.chart.canvas),
        hidden: function () {
            website.memoryCache.chart.data.destroy();
            website.memoryCache.chart.canvas.remove();
            website.memoryCache.chart.modal = null;
            website.memoryCache.chart.canvas = null;
            website.memoryCache.chart.data = null;
            return;
        },
        footer: [

            // Pause
            tinyLib.button(tinyLang.close, 'info').text(buttonPauseMessage).click(function () {

                // Control
                if (website.memoryCache.chart.paused) { website.memoryCache.chart.paused = false; } else {
                    website.memoryCache.chart.paused = true;
                }

                // Auto Update
                updateMemoryCacheData();

                // Complete
                return;

            }),

            // Close
            tinyLib.button(tinyLang.close, 'secondary', { 'data-dismiss': 'modal' })

        ]
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
    website.memoryCache.time.now = moment.tz(data.time, 'Universal').tz(moment.tz.guess());
    if (Array.isArray(data.history.n.usedMem)) { website.memoryCache.n.usedMem = data.history.n.usedMem; }
    if (Array.isArray(data.history.n.freeMem)) { website.memoryCache.n.freeMem = data.history.n.freeMem; }
    if (Array.isArray(data.history.n.totalMem)) { website.memoryCache.n.totalMem = data.history.n.totalMem; }
    if (Array.isArray(data.history.t.usedMem)) { website.memoryCache.t.usedMem = data.history.t.usedMem; }
    if (Array.isArray(data.history.t.freeMem)) { website.memoryCache.t.freeMem = data.history.t.freeMem; }
    if (Array.isArray(data.history.t.totalMem)) { website.memoryCache.t.totalMem = data.history.t.totalMem; }

    // Insert Time
    if (Array.isArray(data.history.n.time)) {

        // Insert Values
        for (const item in data.history.n.time) {
            if (
                !website.memoryCache.time.data[item] || (
                    website.memoryCache.time.original[item] && objectHash(website.memoryCache.time.original[item]) !== objectHash(data.history.n.time[item])
                ) || !website.memoryCache.firstTime
            ) {

                // Insert
                website.memoryCache.time.data.push(moment.tz(data.history.n.time[item], 'Universal').tz(moment.tz.guess()).format('dddd, MMMM Do YYYY, HH:mm:ss'));

                // Repeated Value
                if (website.memoryCache.time.data.length > website.memoryChecker.historyLimit) {
                    website.memoryCache.time.data.shift();
                }

            }
        }

        // Insert New Original
        website.memoryCache.firstTime = true;
        website.memoryCache.time.original = data.history.n.time;

    }

    // Complete
    return updateMemoryCacheData();

});

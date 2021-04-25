// Cache
const memoryCacheHistory = { usedMem: [], freeMem: [], totalMem: [], logUsing: null, logCanvas: null, chart: null };

// Update Chart JS
const updateMemoryCacheData = function () {

    // Exist Log
    if (memoryCacheHistory.logUsing) {

        // Create Canvas
        if (!memoryCacheHistory.chart) {

            // Labels
            const labels = [];
            for (let i = 0; i < memoryCacheHistory.totalMem.length; i++) {
                labels.push('');
            }

            // Color Opacity
            const colorOpacity = {
                usedMemory: 0.4,
                freeMemory: 0.4,
                totalMemory: 0.4
            };

            colorOpacity[memoryCacheHistory.logUsing] = 0.7;
            
            // Create Chart
            const ctx = memoryCacheHistory.logCanvas[0].getContext('2d');
            memoryCacheHistory.chart = new Chart(ctx, {
                responsive: true,
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        /* {
                            label: tinyLang.total_memory,
                            data: memoryCacheHistory.totalMem,
                            backgroundColor: [
                                'rgba(54, 162, 235, ' + colorOpacity.totalMemory + ')'
                            ],
                            borderColor: [
                                'rgba(54, 162, 235, 1)'
                            ],
                            borderWidth: 1
                        }, */
                        {
                            label: tinyLang.free_memory,
                            data: memoryCacheHistory.freeMem,
                            backgroundColor: [
                                'rgba(97, 255, 123, ' + colorOpacity.freeMemory + ')'
                            ],
                            borderColor: [
                                'rgba(132, 255, 66, 1)'
                            ],
                            borderWidth: 1
                        },
                        {
                            label: tinyLang.used_memory,
                            data: memoryCacheHistory.usedMem,
                            backgroundColor: [
                                'rgba(255, 99, 132, ' + colorOpacity.usedMemory + ')'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: 1
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
            memoryCacheHistory.chart.update();

        }

    }

    // Complete
    return console.log(memoryCacheHistory);

};

// Open History
$('[id="openHistoryLog"]').click(function () {

    // Get ID
    const id = $(this).find('span').attr('id');
    memoryCacheHistory.logUsing = id;
    memoryCacheHistory.logCanvas = $('<canvas>').css({ height: '50%', width: '90%' });

    // Protection Click
    $('[id="openHistoryLog"]').css('pointer-events', 'none');
    setTimeout(function () { $('[id="openHistoryLog"]').css('pointer-events', ''); }, 500);

    // Modal
    tinyLib.modal({
        dialog: 'modal-lg',
        id: id + '-log-panel',
        title: tinyLang[id + '_history_title'],
        body: $('<center>').append(memoryCacheHistory.logCanvas),
        hidden: function () {
            memoryCacheHistory.chart.destroy();
            memoryCacheHistory.logCanvas.remove();
            memoryCacheHistory.logUsing = null;
            memoryCacheHistory.logCanvas = null;
            memoryCacheHistory.chart = null;
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

    // Update Values
    if (Array.isArray(data.history.usedMem)) { memoryCacheHistory.usedMem = data.history.usedMem; }
    if (Array.isArray(data.history.freeMem)) { memoryCacheHistory.freeMem = data.history.freeMem; }
    if (Array.isArray(data.history.totalMem)) { memoryCacheHistory.totalMem = data.history.totalMem; }
    updateMemoryCacheData();

});

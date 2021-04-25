// Cache
const memoryCacheHistory = { usedMem: [], freeMem: [], totalMem: [], logUsing: null, logCanvas: null, chart: null };

// Update Chart JS
const updateMemoryCacheData = function () {

    // Exist Log
    if (memoryCacheHistory.logUsing) {

        // Create Canvas
        if (!memoryCacheHistory.chart) {
            const ctx = memoryCacheHistory.logCanvas[0].getContext('2d');
            memoryCacheHistory.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
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

// Cache
const memoryCacheHistory = { usedMem: [], freeMem: [], totalMem: [], logUsing: null, logCanvas: null };

// Update Chart JS
const updateMemoryCacheData = function () {

    // Exist Log
    if (memoryCacheHistory.logUsing) {

        

    }

    // Complete
    return console.log(memoryCacheHistory);;

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
        hidden: function () { memoryCacheHistory.logUsing = null; memoryCacheHistory.logCanvas.remove(); memoryCacheHistory.logCanvas = null; },
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

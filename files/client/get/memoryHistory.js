// Cache
const memoryCacheHistory = { usedMem: [], freeMem: [], totalMem: [], logUsing: null };

// Update Chart JS
const updateMemoryCacheData = function () {

    // Test
    console.log(memoryCacheHistory);

};

// Open History
$('[id="openHistoryLog"]').click(function () {

    // Get ID
    const id = $(this).find('span').attr('id');
    memoryCacheHistory.logUsing = id;

    // Protection Click
    $('[id="openHistoryLog"]').css('pointer-events', 'none');
    setTimeout(function () { $('[id="openHistoryLog"]').css('pointer-events', ''); }, 500);

    // Modal
    tinyLib.modal({
        dialog: 'modal-lg',
        id: id + '-log-panel',
        title: tinyLang[id + '_history_title'],
        body: '',
        hidden: function () { memoryCacheHistory.logUsing = null; },
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

const memoryCacheHistory = { usedMem: [], freeMem: [], totalMem: [] };

// Update Chart JS
const updateMemoryCacheData = function () {

    // Test
    console.log(memoryCacheHistory);

};

// Open History
$('[id="openHistoryLog"]').click(function () {

    // Get ID
    const id = $(this).find('span').attr('id');
    console.log(id);

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

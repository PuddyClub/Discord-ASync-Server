// Log Update
const updateLog = function (data, type) {

    // Update List
    if (!bot.log[type]) { bot.log[type] = { new: 0, list: [] }; }
    if (Array.isArray(data.list)) { bot.log[type].list = data.list; }

    // Exist Item
    if (data.item) {

        // Add New Value
        bot.log[type].new++;

    }

    // Complete
    return;

};

// Logs
socket.on('dsBot_error', (data) => { return updateLog(data, 'error'); });
socket.on('dsBot_warn', (data) => { return updateLog(data, 'warn'); });
socket.on('dsBot_rateLimit', (data) => { return updateLog(data, 'rateLimit'); });
socket.on('dsBot_shardError', (data) => { return updateLog(data, 'shardError'); });
socket.on('dsBot_info', (data) => { return updateLog(data, 'info'); });
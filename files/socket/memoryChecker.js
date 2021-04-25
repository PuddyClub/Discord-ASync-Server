module.exports = (ioCache, cfg) => {

    // Exist Number
    if (cfg && typeof cfg.interval === "number") {

        // Allow Start
        let startInterval = false;
        let os;
        let prettyBytes;

        // Fix Rate
        if (
            typeof cfg.historyLimit !== "number" ||
            isNaN(cfg.historyLimit) ||
            !isFinite(cfg.historyLimit) ||
            cfg.historyLimit < 0
        ) { cfg.historyLimit = 100; }

        // History
        const memoryHistory = {
            items: { totalMem: [], freeMem: [], usedMem: [] }, add: function (value, where) {

                // Is Number
                if (typeof value === "number" && typeof where === "string" && Array.isArray(memoryHistory.items[where])) {

                    // Add Value
                    memoryHistory.items[where].push(value);

                    // Validator
                    if (memoryHistory.items[where].length > cfg.historyLimit) {
                        memoryHistory.item.shift()
                    }

                    // Complete
                    return true

                }

                // Nope
                else { return false; }

            }
        };

        try {

            // Modules
            os = require('os');
            prettyBytes = require('pretty-bytes');

            // Allow Start
            startInterval = true;

        } catch (err) {
            console.error(err);
            os = null;
            prettyBytes = null;
            startInterval = false;
        }

        // Starting Memory Checker
        if (startInterval) {

            console.log('Memory Checker Started!');

            // Interval
            let intervalCPU = setInterval(function () {

                // Check Cache
                if (ioCache && ioCache.users) {

                    // Try
                    try {

                        // Get Memory Usage
                        const memoryUsage = process.memoryUsage();
                        const totalmem = os.totalmem();
                        const freemem = os.freemem();

                        // Memory Value
                        const tinyValue = {
                            totalMem: { number: totalmem },
                            freeMem: { number: freemem },
                            usedMem: { number: memoryUsage.rss }
                        };

                        // Add History
                        if (cfg.historyLimit > 0) {
                            memoryHistory.add(totalmem, 'totalMem');
                            memoryHistory.add(freemem, 'freeMem');
                            memoryHistory.add(memoryUsage.rss, 'usedMem');
                            tinyValue.history = memoryHistory.items;
                        }

                        // Convert
                        if (typeof tinyValue.totalMem.number === "number") { tinyValue.totalMem.value = prettyBytes(totalmem); }
                        if (typeof tinyValue.freeMem.number === "number") { tinyValue.freeMem.value = prettyBytes(freemem); }
                        if (typeof tinyValue.usedMem.number === "number") { tinyValue.usedMem.value = prettyBytes(memoryUsage.rss); }

                        // Send Result
                        for (const userID in ioCache.users) {
                            if (ioCache.users[userID].ids) {
                                for (const id in ioCache.users[userID].ids) {
                                    if (ioCache.users[userID].ids[id].socket) {
                                        ioCache.users[userID].ids[id].socket.emit('machineMemory', tinyValue);
                                    }
                                }
                            }
                        }

                    }

                    // Fail
                    catch (err) {

                        // Error
                        console.error(err);
                        clearInterval(intervalCPU);

                    }

                }

                // Complete
                return;

            }, cfg.interval);

        }

    }

    // Complete
    return;

};


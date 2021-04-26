module.exports = (ioCache, cfg) => {

    // Exist Number
    if (cfg && typeof cfg.interval === "number") {

        // Allow Start
        let startInterval = false;
        let os;
        let prettyBytes;
        let moment;
        let objType;

        // Fix Rate
        if (
            typeof cfg.historyLimit !== "number" ||
            isNaN(cfg.historyLimit) ||
            !isFinite(cfg.historyLimit) ||
            cfg.historyLimit < 0
        ) { cfg.historyLimit = -1; }

        // History
        ioCache.memHistory = {
            lastRequest: null,
            items: {
                n: { totalMem: [], freeMem: [], usedMem: [], time: [] },
                t: { totalMem: [], freeMem: [], usedMem: [] }
            }, add: function (value, where) {

                // Is Number
                if ((typeof value === "number" || objType(value, 'object')) && typeof where === "string" && Array.isArray(ioCache.memHistory.items.n[where])) {

                    // Add Value
                    ioCache.memHistory.items.n[where].push(value);
                    if (typeof value === "number") { ioCache.memHistory.items.t[where].push(prettyBytes(value)); }

                    // Validator
                    if (ioCache.memHistory.items.n[where].length > cfg.historyLimit) {
                        ioCache.memHistory.items.n[where].shift();
                        if (typeof value === "number") { ioCache.memHistory.items.t[where].shift(); }
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
            moment = require('moment-timezone');
            os = require('os');
            prettyBytes = require('pretty-bytes');
            objType = require('@tinypudding/puddy-lib/get/objType');

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

            // Set Interval Function
            const setIntervalFunction = function () {

                // Check Cache
                if (ioCache && ioCache.users) {

                    // Try
                    try {

                        // Get Memory Usage
                        const memoryUsage = process.memoryUsage();
                        const totalmem = os.totalmem();
                        const freemem = os.freemem();

                        if (!ioCache.memHistory.lastRequest) { ioCache.memHistory.lastRequest = {}; }
                        if (!ioCache.memHistory.lastRequest.totalMem) { ioCache.memHistory.lastRequest.totalMem = {}; }
                        if (!ioCache.memHistory.lastRequest.freeMem) { ioCache.memHistory.lastRequest.freeMem = {}; }
                        if (!ioCache.memHistory.lastRequest.usedMem) { ioCache.memHistory.lastRequest.usedMem = {}; }

                        // Memory Value
                        ioCache.memHistory.lastRequest.totalMem.number = totalmem;
                        ioCache.memHistory.lastRequest.freeMem.number = freemem;
                        ioCache.memHistory.lastRequest.usedMem.number = memoryUsage.rss;

                        // Get Time
                        delete ioCache.memHistory.lastRequest.time;
                        ioCache.memHistory.lastRequest.time = moment.utc().toObject();

                        // Add History
                        if (cfg.historyLimit > 0) {
                            ioCache.memHistory.add(totalmem, 'totalMem');
                            ioCache.memHistory.add(freemem, 'freeMem');
                            ioCache.memHistory.add(memoryUsage.rss, 'usedMem');
                            ioCache.memHistory.add(ioCache.memHistory.lastRequest.time, 'time');
                            if (!ioCache.memHistory.lastRequest.history) { ioCache.memHistory.lastRequest.history = ioCache.memHistory.items; }
                        }

                        // Convert
                        if (typeof ioCache.memHistory.lastRequest.totalMem.number === "number") { ioCache.memHistory.lastRequest.totalMem.value = prettyBytes(totalmem); }
                        if (typeof ioCache.memHistory.lastRequest.freeMem.number === "number") { ioCache.memHistory.lastRequest.freeMem.value = prettyBytes(freemem); }
                        if (typeof ioCache.memHistory.lastRequest.usedMem.number === "number") { ioCache.memHistory.lastRequest.usedMem.value = prettyBytes(memoryUsage.rss); }

                        // Send Result
                        for (const userID in ioCache.users) {
                            if (ioCache.users[userID].ids) {
                                for (const id in ioCache.users[userID].ids) {
                                    if (ioCache.users[userID].ids[id].socket) {
                                        ioCache.users[userID].ids[id].socket.emit('machineMemory', ioCache.memHistory.lastRequest);
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

            };

            // Interval
            let intervalCPU = setInterval(setIntervalFunction, cfg.interval);
            setIntervalFunction();

        }

    }

    // Complete
    return;

};


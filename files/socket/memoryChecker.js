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

                        // Memory Value
                        const tinyValue = {
                            totalMem: { number: totalmem },
                            freeMem: { number: freemem },
                            usedMem: { number: memoryUsage.rss }
                        };

                        // Get Time
                        tinyValue.time = moment.utc().toObject();

                        // Add History
                        if (cfg.historyLimit > 0) {
                            ioCache.memHistory.add(totalmem, 'totalMem');
                            ioCache.memHistory.add(freemem, 'freeMem');
                            ioCache.memHistory.add(memoryUsage.rss, 'usedMem');
                            ioCache.memHistory.add(tinyValue.time, 'time');
                            tinyValue.history = ioCache.memHistory.items;
                        }

                        // Convert
                        if (typeof tinyValue.totalMem.number === "number") { tinyValue.totalMem.value = prettyBytes(totalmem); }
                        if (typeof tinyValue.freeMem.number === "number") { tinyValue.freeMem.value = prettyBytes(freemem); }
                        if (typeof tinyValue.usedMem.number === "number") { tinyValue.usedMem.value = prettyBytes(memoryUsage.rss); }

                        // Send Result
                        ioCache.memHistory.lastRequest = tinyValue;
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

            };

            // Interval
            let intervalCPU = setInterval(setIntervalFunction, cfg.interval);
            setIntervalFunction();

        }

    }

    // Complete
    return;

};


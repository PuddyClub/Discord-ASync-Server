module.exports = (ioCache, cfg) => {

    // Exist Number
    if (cfg && typeof cfg.interval === "number") {

        // Allow Start
        let startInterval = false;
        let os;
        let prettyBytes;

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

        if (startInterval) {
            let intervalCPU = setInterval(function () {

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
                        used: { number: memoryUsage.rss }
                    };

                    // Convert
                    if (typeof tinyValue.totalMem.number === "number") { tinyValue.totalMem.value = prettyBytes(totalmem); }
                    if (typeof tinyValue.freeMem.number === "number") { tinyValue.freeMem.value = prettyBytes(freemem); }
                    if (typeof tinyValue.used.number === "number") { tinyValue.used.value = prettyBytes(memoryUsage.rss); }



                }

                // Fail
                catch (err) {

                    // Error
                    console.error(err);
                    clearInterval(intervalCPU);

                }

            }, cfg.interval);
        }

    }

    // Complete
    return;

};


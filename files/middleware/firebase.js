module.exports = function (bot, firebase, fbCfg) {
    return new Promise((resolve, reject) => {

        // Modules
        const objType = require('@tinypudding/puddy-lib/get/objType');

        // Prepare Config
        fbCfg = _.defaultsDeep({}, fbCfg, {

            // Database
            database: ""

        });

        // Is Object
        if (objType(fbCfg, 'object') && typeof fbCfg.database === "string" && fbCfg.database.length > 0) {

            // Result
            resolve();

        }

        // Nope
        else { resolve(); }

        // Complete
        return;

    });
};
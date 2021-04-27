module.exports = function (bot, firebase, fbCfg) {
    return new Promise((resolve, reject) => {

        // Modules
        const objType = require('@tinypudding/puddy-lib/get/objType');

        // Prepare Config
        fbCfg = _.defaultsDeep({}, fbCfg, {



        });

        // Is Object
        if (objType(fbCfg, 'object')) {

            // Result
            resolve();

        }

        // Nope
        else { resolve(); }

        // Complete
        return;

    });
};
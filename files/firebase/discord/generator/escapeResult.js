module.exports = function (obj) {

    // Obj Type
    const objType = require('@tinypudding/puddy-lib/get/objType');

    // Object
    if (objType(obj, 'object')) {
        Object.keys(obj).forEach(key => {
            if (obj[key] === undefined) {
                delete obj[key];
            }
        });
    }

    // Nothing
    else if (obj === undefined) {
        obj = null;
    }

    return obj;

};
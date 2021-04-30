const escapeValuesHere = (obj) => {

    // Obj Type
    const objType = require('@tinypudding/puddy-lib/get/objType');

    // Object
    if (objType(obj, 'object')) {
        Object.keys(obj).forEach(key => {
            if (obj[key] === undefined) {
                delete obj[key];
            } else if (objType(obj[key], 'object') || Array.isArray(obj[key])) {
                obj[key] = escapeValuesHere(obj[key]);
            }
        });
    }

    // Array
    else if (Array.isArray(obj)) {
        for (const key in obj) {
            if (obj[key] === undefined) {
                delete obj[key];
            } else if (objType(obj[key], 'object') || Array.isArray(obj[key])) {
                obj[key] = escapeValuesHere(obj[key]);
            }
        }
    }

    // Nothing
    else if (obj === undefined) {
        obj = null;
    }

    return obj;

};

module.exports = function (obj) { return escapeValuesHere(obj); };
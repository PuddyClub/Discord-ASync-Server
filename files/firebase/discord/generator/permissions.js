module.exports = function (perms) {
    if (perms) {

        // Data
        const data = {
            bitfield: perms.bitfield,
            ALL: perms.ALL,
            FLAGS: perms.FLAGS,
            DEFAULT: perms.DEFAULT
        };

        // Complete
        return data;

    } else { return null; }
};
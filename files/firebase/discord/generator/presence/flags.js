module.exports = function (flags) {
    if (flags) {

        // Data
        const data = {
            bitfield: flags.bitfield,
            FLAGS: flags.FLAGS
        };

        // Complete
        return data;

    } else { return null; }
};
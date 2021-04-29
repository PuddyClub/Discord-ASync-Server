module.exports = function (assets) {
    if (assets) {

        // Data
        const data = {
            largeImage: assets.largeImage,
            largeText: assets.largeText,
            smallImage: assets.smallImage,
            smallText: assets.smallText,
        };

        // Complete
        return data;

    } else { return null; }
};
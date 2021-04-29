module.exports = function (emoji) {

    // Data
    const data = {
        
    };

    // Get Members ID
    if (guild.channels && guild.channels.cache) {
        guild.channels.cache.forEach(function (value, key) {
            data.channels.push(key);
            return;
        });
    }

    // Complete
    return data;

};
module.exports = function (cmd, db, cfg) {
    return new Promise((resolve, reject) => {

        // Prepare Modules
        const guildCreate = require('./guildCreate');
        const moment = require('moment-timezone');
        const forPromise = require('for-promise');

        // Event data
        const data = moment.utc().toObject();
        data.timezone = 'Universal';

        // Send Servers
        if (cfg.readyEventUpdateGuilds && cfg.bot.guilds && cfg.bot.guilds.cache) {

            // Read Guilds List
            const guilds = cfg.bot.guilds.cache.array();
            forPromise({ data: guilds }, function (item, fn, fn_error) {

                // Complete
                console.log(guilds[item]);
                fn();
                return;

            }).then(() => {

                // Set Event
                db.event.set(db.escape(data)).then(resolve).catch(reject);

                // Complete
                return;

            }).catch(reject);

        }

        // Nope
        else { db.event.set(db.escape(data)).then(resolve).catch(reject); }

        // Complete
        return;

    });
};
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

                // Guild
                const guild = guilds[item];

                // Data
                const guildGenerator = require('./generator/guild');
                const data = db.escape(guildGenerator(guild));

                // Guild ID
                const guildID = db.escape(guild.id);

                // Update Channel
                db.root.child('guilds').child(guildID).set(data).then(() => {

                    // Set Event
                    db.event.set({ guild: data }).then(() => {
                        fn(); return;
                    }).catch((err) => {
                        fn_error(err); return;
                    });

                    // Complete
                    return;

                }).catch((err) => {
                    fn_error(err); return;
                });

                // Complete
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
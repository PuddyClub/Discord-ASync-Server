module.exports = async function (req, res, webCfg, web, app) {

    // Exist Session
    if (req.discord_session.user) {

        // Get User Values
        const index = app.users.find(user => user.id === req.discord_session.user.id);

        // Exist
        if (index) {

            // Lang
            const lang = req.i18.getFile('homepage');

            // Bots
            const bots = [];
            for(const item in app.discord.bots) {
                bots.push({
                    username: app.discord.bots[item].bot.user.username,
                    discriminator: app.discord.bots[item].bot.user.discriminator,
                    tag: app.discord.bots[item].bot.user.tag,
                    id: app.discord.bots[item].bot.user.id,
                    avatar: app.discord.bots[item].bot.user.avatarURL({size: 32})
                });
            }
            
            // Render Page
            res.render('homepage', { global: req.globalItems, lang: lang, bots: bots });

        }

        // Nope
        else { res.render('invalid_user', { global: req.globalItems }); }

    }

    // Nope
    else { res.redirect('/login') };

    // Complete
    return;

};
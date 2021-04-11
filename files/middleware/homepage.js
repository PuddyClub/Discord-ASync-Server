module.exports = async function (req, res, webCfg, web, app, checkUser) {

    // Exist Session
    if (req.discord_session.user) {

        // Get User Values
        const userVerification = checkUser(req.discord_session.user.id);

        // Exist
        if (userVerification.perm > 0) {

            // Lang
            const lang = req.i18.getFile('homepage');

            // Bots
            const bots = [];
            for (const item in app.discord.bots) {

                // Avatar
                let avatar = app.discord.bots[item].bot.user.avatarURL({ size: 32 });
                if (!avatar) { avatar = require('@tinypudding/discord-oauth2/get/randomAvatar')(); }

                // Add Item
                bots.push({
                    username: app.discord.bots[item].bot.user.username,
                    discriminator: app.discord.bots[item].bot.user.discriminator,
                    tag: app.discord.bots[item].bot.user.tag,
                    id: app.discord.bots[item].bot.user.id,
                    avatar: avatar
                });

            }

            // Render Page
            res.render('homepage', { global: req.globalItems, lang: lang, bots: bots, langValues: JSON.stringify(lang) });

        }

        // Nope
        else { res.render('invalid_user', { global: req.globalItems }); }

    }

    // Nope
    else { res.redirect('/login') };

    // Complete
    return;

};
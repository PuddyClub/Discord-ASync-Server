module.exports = async function (req, res, webCfg, web, app) {

    // Exist Session
    if (req.discord_session.user) {

        // Get User Values
        const index = app.users.find(user => user.id === req.discord_session.user.id);

        // Exist
        if (index) {

            // Render Page
            res.render('homepage', { global: req.globalItems });

        }

        // Nope
        else { res.render('invalid_user', { global: req.globalItems }); }

    }

    // Nope
    else { res.redirect('/login') };

    // Complete
    return;

};
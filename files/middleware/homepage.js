module.exports = async function (req, res, webCfg, web, app) {

    // Exist Session
    if(req.discord_session.user) {

        console.log(req);
        res.render('test');

    }

    // Nope
    else {res.redirect('/login')};

    // Complete
    return;

};
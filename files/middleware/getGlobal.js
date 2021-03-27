module.exports = function (web, callback) {
    return function (req, res, next) {

        // Prepare Global
        req.globalItems = {
            url: { normal: req.url, uri: encodeURIComponent(req.url) },
            csrftoken: req.csrfToken,
            hostname: web.cfg.domain,
            botOwner: '152145019296284672',
            user: req.discord_session.user,
            cache_code: 1
        };

        // Year Footer
        req.globalItems.year_footer = req.utc_clock.now.year();
        if (req.globalItems.year_footer !== 2021) {
            req.globalItems.year_footer = "2021 - " + req.globalItems.year_footer;
        }

        // Complete
        callback(req, res, next);
        return;

    };
};
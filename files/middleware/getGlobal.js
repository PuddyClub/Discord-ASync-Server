module.exports = function (web, fileCfg, callback) {
    return function (req, res, next) {

        // Prepare Global
        req.globalItems = {
            lang: req.i18.getFile('global'),
            i18List: req.i18.getSelectedLang(), 
            i18ClientRequest: req.i18.getClientWeb(),
            url: { normal: req.url, uri: encodeURIComponent(req.url) },
            csrftoken: req.csrfToken,
            hostname: web.cfg.domain,
            user: req.discord_session.user,
            cache_code: 1,
            head: fileCfg,
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
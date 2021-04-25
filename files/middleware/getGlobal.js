module.exports = function (web, fileCfg, memoryChecker, callback) {
    return function (req, res, next) {

        // Prepare Global
        req.globalItems = {
            url: { normal: req.url, uri: encodeURIComponent(req.url) },
            csrftoken: req.csrfToken,
            hostname: web.cfg.domain,
            user: req.discord_session.user,
            cache_code: 1,
            head: fileCfg,
            existMemoryInterval: (memoryChecker && typeof memoryChecker.interval === "number"),
            allowMemoryHistory: (memoryChecker && typeof memoryChecker.historyLimit === "number" && memoryChecker.historyLimit > 0),
            memoryChecker: JSON.stringify(memoryChecker),
        };

        // Get Date
        try {

            // Prepare i18
            req.globalItems.lang = req.i18.getFile('global');
            req.globalItems.i18List = req.i18.getSelectedLang();
            req.globalItems.i18ClientRequest = req.i18.getClientWeb();

            // Year Footer
            req.globalItems.year_footer = req.utc_clock.now.year();
            if (req.globalItems.year_footer !== 2021) {
                req.globalItems.year_footer = "2021 - " + req.globalItems.year_footer;
            }

        } catch (err) { }

        // Complete
        callback(req, res, next);
        return;

    };
};
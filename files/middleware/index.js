module.exports = async function (resolve, reject, interactionsID, webCfg, web, app) {

    // Nunjucks
    const path = require('path');
    const nunjucks = require('nunjucks');
    nunjucks.configure(path.join(__dirname, '../views'), {
        autoescape: true,
        express: web.app
    });

    web.app.set('view engine', 'nunjucks');

    // Modules
    const bodyParser = require('body-parser');

    // Create Express App
    app.web.server = require('http').createServer(web.app);

    // bot Checker
    if (webCfg.botChecker) { app.web.io = require('socket.io')(app.web.server); }

    // Body Parser
    web.app.use(bodyParser.json());
    web.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    // Extra
    if (typeof webCfg.middleware === "function") { await webCfg.middleware(web, app); }

    // Homepage
    web.app.get('/', web.dsSession(), (req, res) => { return require('./homepage')(req, res, webCfg, web, app); });

    // Load Bots and Start the Website
    if (app.bots && app.bots.length > 0) {

        require('for-promise')({ data: app.bots }, function (i, fn, fn_error) {

            // Complete
            app.bots[i].bot.login(app.bots[i].token).then(() => { return fn(); }).catch(err => { return fn_error(err); });
            return;

        }).then(() => {

            // Complete
            web.fn();
            resolve();
            return;

        }).catch(err => {
            reject(err);
            return;
        });

        return;

    }

    // Nope
    else { web.fn(); resolve(); return; }

};
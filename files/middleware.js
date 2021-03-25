module.exports = async function (resolve, webCfg, web, app) {

    // Nunjucks
    const path = require('path');
    const nunjucks = require('nunjucks');
    nunjucks.configure(path.join(__dirname, './views'), {
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
    web.app.get('/', web.dsSession(), (req, res) => {
        console.log('Page!');
        res.render('test');
        return;
    });

    return require('for-promise')({ data: app.bots }, function (i, fn, fn_error) {

        // Complete
        app.bots[i].bot(app.bots[i].token).then(() => { return fn(); }).catch(err => { return fn_error(err); });
        return;

    }).then(() => {

        // Complete
        web.fn();
        resolve();
        return;

    }).catch(err => {
        console.error(err);
        return;
    })

};
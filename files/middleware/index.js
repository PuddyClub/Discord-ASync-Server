module.exports = async function (resolve, reject, webCfg, web, app) {

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

    // Bot Checker
    if (webCfg.botChecker) { web.app.get('/', web.dsSession({ getUser: true }), (req, res) => { return require('./homepage')(req, res, webCfg, web, app); }); }

    // Interaction
    if (webCfg.slashCommandListener && webCfg.slashCommandListener.enabled && typeof webCfg.slashCommandListener.function === "string") {
    
        // Prepare Firebase Functions
        const functions = app.firebase.functions();

        // Insert Interactions Endpoint
        web.app.get('/interactions/endpoint', (req, res) => {
            return require('./interactionEndPoint')(req, res, webCfg.slashCommandListener, functions);
        });
    
    }

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
module.exports = async function (resolve, reject, discordCfg, webCfg, fileCfg, web, app) {

    // Nunjucks
    const express = require('express');
    const path = require('path');
    const fs = require('fs');
    const nunjucks = require('nunjucks');
    nunjucks.configure(path.join(__dirname, '../views'), {
        autoescape: true,
        express: web.app
    });

    web.app.set('view engine', 'nunjucks');
    web.express = express;

    // Modules
    const bodyParser = require('body-parser');
    const interactionEndPoint = require('./interactionEndPoint');
    const homepage = require('./homepage');
    const getGlobal = require('./getGlobal');

    // Create Express App
    app.web.server = require('http').createServer(web.app);

    // bot Checker
    if (webCfg.botChecker) { app.web.io = require('socket.io')(app.web.server); }

    // Body Parser
    web.app.use(bodyParser.json());
    web.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    // Files
    web.app.use(express.static(path.join(__dirname, "../public"), {
        maxAge: '2592000000' // uses milliseconds per docs
    }));

    // Extra
    if (typeof webCfg.middleware === "function") { await webCfg.middleware(web, app); }

    // Files
    const fileAge = '2592000000';

    // Main
    web.app.get('/js/main.js', function (req, res, next) {
        return readFile(
            res, next, {
            file: fs.readFileSync(path.join(__dirname, '../client/main.js')),
            date: { year: 2021, month: 3, day: 30, hour: 17, minute: 29 },
            timezone: 'America/Sao_Paulo',
            fileMaxAge: fileAge
        }
        );
    });

    // Homepage
    web.app.get('/js/main.js', function (req, res, next) {
        return readFile(
            res, next, {
            file: fs.readFileSync(path.join(__dirname, '../client/homepage.js')),
            date: { year: 2021, month: 3, day: 30, hour: 17, minute: 29 },
            timezone: 'America/Sao_Paulo',
            fileMaxAge: fileAge
        }
        );
    });

    // Terms
    web.app.get('/tos', getGlobal(web, fileCfg, (req, res) => { return res.render('tos', { global: req.globalItems }); }));
    web.app.get('/privacy', getGlobal(web, fileCfg, (req, res) => { return res.render('privacy', { global: req.globalItems }); }));

    // Bot Checker
    if (webCfg.botChecker) { web.app.get('/', web.dsSession({ getUser: true }), getGlobal(web, fileCfg, (req, res) => { return homepage(req, res, webCfg, web, app); })); }

    // Interaction
    if (
        webCfg.slashCommandListener &&
        webCfg.slashCommandListener.enabled &&
        typeof webCfg.slashCommandListener.function === "string" &&
        discordCfg && discordCfg.apps
    ) {

        // Insert Interactions Endpoint
        web.app.all('/interactions/endpoint', (req, res) => {
            return interactionEndPoint(req, res, webCfg.slashCommandListener, app.firebase, discordCfg.apps);
        });

    }

    // Load Bots and Start the Website
    if (app.discord.bots && app.discord.bots.length > 0) {

        require('for-promise')({ data: app.discord.bots }, function (i, fn, fn_error) {

            // Complete
            app.discord.bots[i].bot.login(app.discord.bots[i].token).then(() => { return fn(); }).catch(err => { return fn_error(err); });
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
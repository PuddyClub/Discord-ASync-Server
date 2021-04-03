module.exports = async function (resolve, reject, discordCfg, webCfg, fileCfg, web, app) {

    // Nunjucks
    const express = require('express');
    const checkUser = require('../checkUser')(app);
    const objType = require('@tinypudding/puddy-lib/get/objType');
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
    let pluginSettings;
    if (typeof webCfg.middleware === "function") {
        pluginSettings = await webCfg.middleware(web, app);
        if (!objType(pluginSettings, 'object')) { pluginSettings = {}; }
    }

    // Files
    const readFile = require('@tinypudding/puddy-lib/http/fileCache');
    const fileAge = '2592000000';

    // Main
    web.app.get('/js/main.js', function (req, res, next) {
        return readFile(
            res, next, {
            file: fs.readFileSync(path.join(__dirname, '../client/main.js'), 'utf8'),
            date: { year: 2021, month: 3, day: 30, hour: 17, minute: 29 },
            timezone: 'America/Sao_Paulo',
            fileMaxAge: fileAge
        }
        );
    });

    // Homepage
    web.app.get('/js/homepage.js', function (req, res, next) {
        return readFile(
            res, next, {
            file: fs.readFileSync(path.join(__dirname, '../client/homepage.js'), 'utf8')
                .replace('{ { server_list_script } }', fs.readFileSync(path.join(__dirname, '../client/server_list.js'), 'utf8'))
                .replace('{ { log_update_script } }', fs.readFileSync(path.join(__dirname, '../client/update_log.js'), 'utf8'))
                .replace('{ { tools_script } }', fs.readFileSync(path.join(__dirname, '../client/toolsCreator.js'), 'utf8')),
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
    if (webCfg.botChecker) {

        // Homepage
        web.app.get('/', web.dsSession({ getUser: true }), getGlobal(web, fileCfg, (req, res) => { return homepage(req, res, webCfg, web, app, checkUser); }));

        // Socket IO

        // Cache
        const ioCache = {};

        // Socket IO Script
        const tinySocket = require('@tinypudding/puddy-lib/socket.io');

        // Start Socket IO
        const socketListener = require('../socket');
        require('../socket/discord')(ioCache, app.web.io, app.discord);
        app.web.io.on("connection", (socket) => {
            tinySocket['cookie-session'](socket, web.cookieSession).then((session) => {

                // Exist Session
                if (session && session.access_token) {

                    // Get Discord Session
                    return tinySocket.discord(socket, ioCache, session.access_token).then(user => {

                        // Verified User
                        const isVerified = checkUser(user.data.id);
                        if (isVerified.permLevel > 0) { return socketListener(pluginSettings.socket, socket, ioCache, app.web.io, session, web, app, user, isVerified.permLevel); }

                        // Nope
                        else { return socket.disconnect(); }


                    }).catch(err => { return socket.disconnect(); });

                }

                // Nope
                else {
                    return socket.disconnect();
                }

            });
            return;
        });

    }

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
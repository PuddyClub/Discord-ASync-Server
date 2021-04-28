module.exports = async function (resolve, reject, ioCache, discordCfg, webCfg, fileCfg, web, app) {

    // Nunjucks
    const express = require('express');
    const checkUser = require('../checkUser')(app);
    let path;
    let fs;
    let nunjucks;

    if (webCfg.botChecker) {
        path = require('path');
        fs = require('fs');
        nunjucks = require('nunjucks');
        nunjucks.configure(path.join(__dirname, '../views'), {
            autoescape: true,
            express: web.app
        });
        web.app.set('view engine', 'nunjucks');
    }

    web.express = express;

    // Modules
    const bodyParser = require('body-parser');
    const interactionEndPoint = require('./interactionEndPoint');

    // Create Express App
    app.web.server = require('http').createServer(web.app);

    // bot Checker
    if (webCfg.botChecker) {

        // Start IO Server
        app.web.io = require('socket.io')(app.web.server);

        // Memory Checker
        require('../socket/memoryChecker')(ioCache, webCfg.memoryChecker);

    }

    // No Index
    web.app.use((req, res, next) => {
        res.setHeader('X-Robots-Tag', 'noindex');
        return next();
    });

    // Bot Checker
    if (webCfg.botChecker) {

        // Modules
        const homepage = require('./homepage');
        const getGlobal = require('./getGlobal');
        const objType = require('@tinypudding/puddy-lib/get/objType');

        // Files
        web.app.use(express.static(path.join(__dirname, "../public"), {
            maxAge: '2592000000' // uses milliseconds per docs
        }));

        // Extra
        let pluginSettings;
        if (typeof webCfg.middleware === "function") {
            pluginSettings = await webCfg.middleware(web, app);
            if (!objType(pluginSettings, 'object')) { pluginSettings = {}; }
        } else { pluginSettings = {}; }

        // Files
        const readFile = require('@tinypudding/puddy-lib/http/fileCache');
        const fileAge = '2592000000';

        // For Promise
        web.app.get('/js/forPromise.js', function (req, res, next) {
            return readFile(
                res, next, {
                file: require('for-promise/getBrowserVersion')(),
                date: { year: 2021, month: 3, day: 30, hour: 17, minute: 29 },
                timezone: 'America/Sao_Paulo',
                fileMaxAge: fileAge
            }
            );
        });

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

        // Robots
        web.app.get('/robots.txt', function (req, res, next) {
            return readFile(
                res, next, {
                contentType: 'text/plain',
                file: fs.readFileSync(path.join(__dirname, '../client/robots.txt'), 'utf8'),
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
                    .replace('{ { connection } }', fs.readFileSync(path.join(__dirname, '../client/connection.js'), 'utf8'))
                    .replace('{ { select_bot } }', fs.readFileSync(path.join(__dirname, '../client/select_bot.js'), 'utf8'))
                    .replace('{ { get_emojis } }', fs.readFileSync(path.join(__dirname, '../client/get/emojis.js'), 'utf8'))
                    .replace('{ { get_roles } }', fs.readFileSync(path.join(__dirname, '../client/get/roles.js'), 'utf8'))
                    .replace('{ { get_channels } }', fs.readFileSync(path.join(__dirname, '../client/get/channels.js'), 'utf8'))
                    .replace('{ { tools_script } }', fs.readFileSync(path.join(__dirname, '../client/toolsCreator.js'), 'utf8'))
                    .replace('{ { memory_history } }', fs.readFileSync(path.join(__dirname, '../client/get/memoryHistory.js'), 'utf8'))
                    .replace('var prettyBytes;', fs.readFileSync(path.join(__dirname, '../client/get/prettyBytes.js'), 'utf8'))
                    .replace('var objType;', `var objType = ${objType.toString()};`),
                date: { year: 2021, month: 3, day: 30, hour: 17, minute: 29 },
                timezone: 'America/Sao_Paulo',
                fileMaxAge: fileAge
            }
            );
        });

        // Terms
        web.app.get('/tos', getGlobal(web, fileCfg, webCfg.memoryChecker, (req, res) => { return res.render('tos', { global: req.globalItems }); }));
        web.app.get('/privacy', getGlobal(web, fileCfg, webCfg.memoryChecker, (req, res) => { return res.render('privacy', { global: req.globalItems }); }));

        // Homepage
        web.app.get('/', web.dsSession({ getUser: true }), getGlobal(web, fileCfg, webCfg.memoryChecker, (req, res) => { return homepage(req, res, webCfg, web, app, checkUser); }));

        // Socket IO

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
                        if (isVerified.perm > 0) { return socketListener(pluginSettings.socket, socket, ioCache, app.web.io, session, web, app, user, isVerified); }

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
        web.app.post('/interactions/endpoint', bodyParser.text({ type: '*/*' }), (req, res) => {
            return interactionEndPoint(req, res, webCfg.slashCommandListener, { root: app.firebase }, discordCfg.apps);
        });

    }

    // Load Bots and Start the Website
    if (app.discord.bots && app.discord.bots.length > 0) {

        // Get Firebase
        const firebaseDiscord = require('./firebase');

        // For Promise
        require('for-promise')({ data: app.discord.bots }, function (i, fn, fn_error) {

            // Complete
            firebaseDiscord(app.discord.bots[i].bot, app.discord.bots[i].fbCfg, app.firebase).then(() => {

                app.discord.bots[i].bot.login(app.discord.bots[i].token).then(() => { return fn(); }).catch(err => { return fn_error(err); });
                return;

            }).catch(err => { return fn_error(err); });
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
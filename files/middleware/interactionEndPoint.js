// Preparing Module
let interactionsEndpoint;
const firebaseEndPoint = require('@tinypudding/firebase-discord-interactions/functionListener/firebaseCallback/client');

// Export
module.exports = function (req, res, cfg, firebase, discordApps) {

    // Get Error Page
    const errorPage = require('@tinypudding/puddy-lib/http/HTTP-1.0');

    // Verify Interaction ID
    if (typeof req.query.id === "string" && req.query.id === cfg.id) {

        // Bot
        if (discordApps[req.query.bot]) {

            // Prepare Module
            if (!interactionsEndpoint) {
                interactionsEndpoint = firebaseEndPoint({
                    callbackName: cfg.function,
                    objString: cfg.objString,
                    debug: cfg.debug,
                    firebase: firebase,
                    app: discordApps,
                    errorCallback: function (req, res, code, message) {

                        // Console Error
                        console.error('Firebase-Discord-Interactions ERROR!');
                        const errorMEssage = { code: code, message: message, body: { normal: req.body, raw: req.rawBody } };

                        if (!cfg.objString) { console.error(errorMEssage); } else {
                            console.error(JSON.stringify(errorMEssage, null, 2));
                        }

                        // Send Error HTTP
                        if (req) {
                            res.status(code);
                            return res.json({ code: code, message: message });
                        } else { return; }

                    },
                    varNames: { bot: 'bot' }
                });
            }

            // Fix Raw
            if (typeof req.rawBody !== "string" && typeof req.body !== "undefined") {

                // Insert Body Here
                const clone = require('clone');
                req.rawBody = clone(req.body);

                // Convert Data
                if (typeof req.rawBody !== "string") {
                    try { req.rawBody = JSON.stringify(req.rawBody); } catch (err) {

                        console.error('Error Raw Body!');
                        if (!cfg.objString) { console.error(err); } else {
                            console.error(JSON.stringify(err, null, 2));
                        }

                        req.rawBody = '';

                    }
                }

            }

            // Fix Body
            if (typeof req.body === "string") {
                try { req.body = JSON.parse(req.body); } catch (err) {

                    console.error('Error Body!');
                    if (!cfg.objString) { console.error(err); } else {
                        console.error(JSON.stringify(err, null, 2));
                    }

                    req.body = {};

                }
            }

            // Send Command
            return interactionsEndpoint(req, res, discordApps[req.query.bot].waitMessage).then(function (data) {
                
                if (!data.success) {
                    console.error('Firebase-Discord-Interactions Server ERROR!');
                    console.error(data.error);
                }
                
                return;

            }).catch((err) => {
                console.error('Firebase-Discord-Interactions Server ERROR!');
                console.error(err);
                return;
            });

        }

        // Nope
        else { console.error('Bot not found.'); errorPage.send(res, 404); }

    }

    // Nope
    else { errorPage.send(res, 401); }

    // Complete
    return;

};
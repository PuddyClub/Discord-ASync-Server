// Preparing Module
let interactionsEndpoint;
const firebaseEndPoint = require('@tinypudding/firebase-discord-interactions/functionListener/firebaseCallback/client');

// Export
module.exports = function (req, res, cfg, firebase, discordApps) {

    // Get Error Page
    const errorPage = require('@tinypudding/puddy-lib/http/HTTP-1.0');
    const objType = require('@tinypudding/puddy-lib/get/objType');

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
                    hiddenDetector: cfg.hiddenDetector,
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

            // Send Error Console
            const sendErrorConsole = function (type, err) {

                // Prepare Error Message
                let errorMessage = type + ' Firebase-Discord-Interactions Server ERROR!';
                if (err && typeof err !== "string" && typeof err.message === "string") { errorMessage += ' ' + err.message; }

                // No String
                if (typeof err !== "string") {

                    // Print Errors
                    console.error(errorMessage);
                    console.error(err);

                }

                // String
                else { console.error(errorMessage + ' ' + err); }

                return;

            };

            // Message
            const msgToSend = { tts: false, content: discordApps[req.query.bot].waitMessage };

            // Is Hidden
            let isHidden = false;

            // Hidden Checker
            const hiddenChecker = (getItem) => {

                // Boolean
                let isBoolean = false;

                // String
                if (typeof cfg.hiddenDetector.description === "string") {

                    // Check
                    if (getItem.boolean(cfg.hiddenDetector.description)) {
                        isBoolean = true;
                    }

                }

                // Array
                else if (Array.isArray(cfg.hiddenDetector.description) && cfg.hiddenDetector.description.length > 0) {
                    for (const hvalue in cfg.hiddenDetector.description) {

                        // Check
                        if (typeof cfg.hiddenDetector.description[hvalue] === "string" && getItem.boolean(cfg.hiddenDetector.description[hvalue])) {
                            isBoolean = true;
                            break;
                        }

                    }
                }

                // Complete
                if (isBoolean) { isHidden = true; }
                return;

            };

            // Hidden Command
            if (isHidden) { msgToSend.flags = 64; }

            // Send Command
            return interactionsEndpoint(req, res, msgToSend).then(function (item) {

                // Exist Data
                if (objType(item, 'object') && objType(item.data, 'object')) {

                    // Error Message
                    if (!item.data.success) {
                        if (item.data.error) { sendErrorConsole('(THEN 1)', item.data.error); }
                        if (item.data.data) { sendErrorConsole('(THEN 2)', item.data.data); }
                    }

                }

                // No Data
                else { sendErrorConsole('(NULL)', 'No Data'); }

                return;

            })

                // Error
                .catch((err) => { return sendErrorConsole('(CATCH)', err); });

        }

        // Nope
        else { console.error('Bot not found.'); errorPage.send(res, 404); }

    }

    // Nope
    else { errorPage.send(res, 401); }

    // Complete
    return;

};
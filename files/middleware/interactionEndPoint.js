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
                    firebase: firebase,
                    app: discordApps,
                    errorCallback: function (req, res, code, message) {
                        res.status(code);
                        return res.json({ code: code, message: message });
                    },
                    varNames: { bot: 'bot' }
                });
            }

            return interactionsEndpoint(req, res, discordApps[req.query.bot].waitMessage).err((err) => {
                console.error(err);
            });

        }

        // Nope
        else { errorPage.send(res, 404); }

    }

    // Nope
    else { errorPage.send(res, 401); }

    // Complete
    return;

};
// Preparing Module
let interactionsEndpoint;
const firebaseEndPoint = require('@tinypudding/firebase-discord-interactions/functionListener/firebaseCallback/client');;

// Export
module.exports = async function (req, res, cfg, firebase) {

    // Get Error Page
    const errorPage = require('@tinypudding/puddy-lib/http/HTTP-1.0');

    // Verify Interaction ID
    if (typeof req.query.id === "string" && req.query.id === cfg.id) {

        // Prepare Module
        if (!interactionsEndpoint) {
            interactionsEndpoint = firebaseEndPoint({
                firebase: firebase,
                app: {},
                varNames: { bot: 'bot' }
            });
        }



        console.log(cfg);
        res.send('cfg.token and cfg.function');
    }

    // Nope
    else { errorPage.send(res, 401); }

    // Complete
    return;

};
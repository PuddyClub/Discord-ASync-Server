module.exports = async function (req, res, cfg) {

    // Get Error Page
    const errorPage = require('@tinypudding/puddy-lib/http/HTTP-1.0');

    // Verify Interaction ID
    if(typeof req.query.id === "string" && req.query.id === cfg.id){
        console.log(cfg);
        res.send('cfg.token and cfg.function');
    }

    // Nope
    else { errorPage.send(res, 401); }

    // Complete
    return;

};
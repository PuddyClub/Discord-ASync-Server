// Tiny Config
const tinyCfg = require('./config.json');
const fetch = require('@tinypudding/puddy-lib/http/fetch/json');

// Get Module
const ds = require('../index');

// Starting
console.log('Starting App! Getting the Firebase Token...');
fetch(tinyCfg.tokenURL, { method: "POST", body: JSON.stringify({ "token": tinyCfg.token }), headers: { 'Content-Type': 'application/json' }).then((data) => {

    // Start Firebase
    ds.firebase.start(tinyCfg);
    ds.firebase.login(data.token).then((user) => {

        // Login Complete
        console.log('Login in Firebase Complete');
        console.log(user);

        // Complete
        return;

    }).catch(err => { console.error(err); return; });

}).catch(err => { console.error(err); return; });

setInterval(function () { }, 1000);
// Tiny Config
const tinyCfg = require('./config.json');
const fetch = require('@tinypudding/puddy-lib/http/fetch/json');

// Get Module
const ds = require('../index');

// Get Token
const tokenLogin = function () {
    return new Promise((resolve, reject) => {
        fetch(tinyCfg.tokenURL, {
            method: "POST",
            body: JSON.stringify({ "token": tinyCfg.token }),
            headers: { 'Content-Type': 'application/json' }
        }).then((data) => { resolve(data.token); return; }).catch(err => { reject(err); return; });
    });
};

// Starting
console.log('Starting App! Getting the Firebase Token...');


// Start Firebase
ds.firebase.start(tinyCfg.firebase);
ds.firebase.login(tokenLogin).then((user) => {

    // Login Complete
    console.log('Login in Firebase Complete');
    console.log(user);

    // Complete
    return;

}).catch(err => { console.error(err); return; });

setInterval(function () { }, 1000);
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

// onAuthStateChanged
ds.firebase.onAuthStateChanged((data => {

    // is User
    if (data) {
        console.log('Firebase Auth received User Data!');
        console.log(data);
    }

    // Nope
    else {
        console.log('Firebase Auth received a empty User Data!');
    }

}));

// Start Firebase
ds.firebase.start(tinyCfg.firebase);
ds.firebase.login(tokenLogin).then((user) => {

    // Login Complete
    console.log('Login in Firebase Complete');

    // Prepare Express
    ds.express.setCookieSession({

    });

    ds.express.create();

    // Start Express
    ds.express.start(3000, function () {
        console.log('Server Started: http://localhost:3000');
    });

    // Complete
    return;

}).catch(err => { console.error(err); return; });
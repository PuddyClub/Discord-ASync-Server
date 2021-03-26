// Tiny Config
const tinyCfg = require('./config.json');
const fetch = require('@tinypudding/puddy-lib/http/fetch/json');
tinyCfg.testMode = true;

// Get Module
const ds = require('../index');

// Get Token
const tokenLogin = function () {
    return new Promise((resolve, reject) => {
        fetch(tinyCfg.tokenURL, {
            method: "POST",
            body: JSON.stringify({ "token": tinyCfg.web.slashCommandListener.token }),
            headers: { 'Content-Type': 'application/json' }
        }).then((data) => { resolve(data.token); return; }).catch(err => { reject(err); return; });
    });
};

// Starting
console.log('Starting App! Getting the Firebase Token...');

// Add Bot
const bot = ds.addBot(tinyCfg.testBot, { autoReconnect: true });
bot.on('ready', (event) => {

    // Welcome
    console.log(`Discord Logged in as ${bot.user.tag}!`);

});

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

// Middleware
tinyCfg.web.middleware = function (web, app) {

    // Warn
    console.log('Starting Middleware...');

    /// Complete
    return;

};

// Start Firebase
ds.firebase.start(tinyCfg.firebase);
ds.firebase.login(tokenLogin).then((user) => {

    // Login Complete
    console.log('Login in Firebase Complete');

    // Prepare Express
    ds.express.setCookieSession(tinyCfg.cookieSession);
    ds.express.create(tinyCfg).then(() => {

        // Start Express
        ds.express.start(3000, function () {
            console.log('Server Started: http://localhost:3000');
        });

    });

    // Complete
    return;

}).catch(err => { console.error(err); return; });
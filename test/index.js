// Tiny Config
const tinyCfg = require('./config.json');
const fetch = require('@tinypudding/puddy-lib/http/fetch/json');
tinyCfg.testMode = true;

// Files
tinyCfg.js = {
    'jquery': `<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js" integrity="sha512-DUC8yqWf7ez3JD1jszxCWSVB0DMP78eOyBpMa5aJki1bIRARykviOuImIczkxlj1KhVSyS16w2FSQetkD4UU2w==" crossorigin="anonymous"></script>`,
    'chart': `<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js" integrity="sha512-d9xgZrVZpmmQlfonhQUvTR7lMPtO7NkZMkA0ABN3PHCbKA5nqylQ/yWlFAyY6hYgdF1Qh6nYiuADWwKB4C2WSw==" crossorigin="anonymous"></script>`,
    'bootstrap': `<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/js/bootstrap.bundle.min.js" integrity="sha512-wV7Yj1alIZDqZFCUQJy85VN+qvEIly93fIQAN7iqDFCPEucLCeNFz4r35FCo9s6WrpdDQPi80xbljXB8Bjtvcg==" crossorigin="anonymous"></script>`,
    'loadingoverlay': `<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-loading-overlay/2.1.7/loadingoverlay.min.js" integrity="sha512-hktawXAt9BdIaDoaO9DlLp6LYhbHMi5A36LcXQeHgVKUH6kJMOQsAtIw2kmQ9RERDpnSTlafajo6USh9JUXckw==" crossorigin="anonymous"></script>`,
    'easing': `<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js" integrity="sha512-0QbL0ph8Tc8g5bLhfVzSqxe9GERORsKhIn1IrpxDAgUsbBGz/V7iSav2zzW325XGd1OMLdL4UiqRJj702IeqnQ==" crossorigin="anonymous"></script>`,
};

tinyCfg.css = {
    'fontnunito': `<link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet"></link>`,
    'bootstrap': `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css" integrity="sha512-P5MgMn1jBN01asBgU0z60Qk4QxiXo86+wlFahKrsQf37c9cro517WzVSPPV1tDKzhku2iJ2FVgL67wG03SGnNA==" crossorigin="anonymous" />`,
    'fontawesome': `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />`,
};

tinyCfg.custom = '<style id="test"></style>';

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
    return {

        // Socket Plugin
        socket: function (i) {

            console.log('User Connected!');
            console.log(i);

            // Disconnected
            i.socket.on('disconnect', (reason) => {
                console.log(reason); // "ping timeout"
            });

        }

    };

};

// Add Global User
ds.addUser('152145019296284672', 4);

// Add More Permissions
ds.addUser('152145019296284672', {
    perm: 4,
    guildsPerm: {'5435': 4},
    botsPerm: {'5435': 4}
});

// Start Firebase
ds.firebase.start(tinyCfg.firebase);
ds.firebase.login(tokenLogin).then((user) => {

    /* user value is the value returned from login with custom token */

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
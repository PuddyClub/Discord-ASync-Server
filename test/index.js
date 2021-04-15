/* Load the Config File. You can see the example file in config_example.json */
const tinyCfg = require('./config.json');
const fetch = require('@tinypudding/puddy-lib/http/fetch/json');

// Enable the Test Mode. You may encounter some unstable features if you activate the test mode.
tinyCfg.testMode = true;

/* 

    Static Files. You can create new static files using the express module.
    The path values of these files must be entered here.

*/
tinyCfg.js = {
    'clipboardjs': `<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js" integrity="sha512-sIqUEnRn31BgngPmHt2JenzleDDsXwYO+iyvQ46Mw6RL+udAUZj2n/u/PGY80NxRxynO7R9xIGx5LEzw4INWJQ==" crossorigin="anonymous"></script>`,
    'jsziputils': `<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js" integrity="sha512-3WaCYjK/lQuL0dVIRt1thLXr84Z/4Yppka6u40yEJT1QulYm9pCxguF6r8V84ndP5K03koI9hV1+zo/bUbgMtA==" crossorigin="anonymous"></script>`,
    'jszip': `<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js" integrity="sha512-uVSVjE7zYsGz4ag0HEzfugJ78oHCI1KhdkivjQro8ABL/PRiEO4ROwvrolYAcZnky0Fl/baWKYilQfWvESliRA==" crossorigin="anonymous"></script>`,
    'downloadjs': `<script src="https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js" integrity="sha512-WiGQZv8WpmQVRUFXZywo7pHIO0G/o3RyiAJZj8YXNN4AV7ReR1RYWVmZJ6y3H06blPcjJmG/sBpOVZjTSFFlzQ==" crossorigin="anonymous"></script>`,
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

/* Custom HEAD Tags */
tinyCfg.custom = `
<script>
$(() => {
// Test Log
receiveLog = function (type, isNew, data) {
    let newValue = '';
    if (isNew) { newValue = '(NEW)' }
    console.log(type + ' '+ newValue +':', data);
};
});
</script>
`;

/* 

    Get Module
    Correct Code: const ds = require('@tinypudding/discord-firebase-async-server');

*/
const ds = require('../index');


/* 

    Get Firebase Login Token.
    You need to create a secure URL on your Firebase server to obtain the token to log in to your server.
    Your script inside the Firebase Server should be returned like the example below.

    firebase.auth().createCustomToken('example_user_uid').then((customToken) => {
        return res.json({ token: customToken });
    }).catch(async (err) => {
        await logger.error('ERROR CREATE DISCORD ROOT TOKEN:', err);
        return error_page(res, 500, err.message);
    });

    When you get the Token value, use the callback "resolve(data.token);" to send the token into the app.

*/
const tokenLogin = function () {
    return new Promise((resolve, reject) => {
        fetch(tinyCfg.tokenURL, {
            method: "POST",
            body: JSON.stringify({ "token": tinyCfg.web.slashCommandListener.token }),
            headers: { 'Content-Type': 'application/json' }
        }).then((data) => { resolve(data.token); return; }).catch(err => { reject(err); return; });
    });
};

// Starting App...
console.log('Starting App! Getting the Firebase Token...');

/* 

    This script will add your bot to the application and return the Discord.JS Client.
  
    The first value is the bot token.
    The second value is the object inserted inside the method "bot.login();", which will be activated automatically when you start the application server.
    
    Examploe: bot.login({ autoReconnect: true });

*/
const bot = ds.addBot(tinyCfg.testBot, { autoReconnect: true });

/* Example code of bot.on() from Discord.JS */
bot.on('ready', (event) => {

    // Welcome Message when the bot start.
    console.log(`Discord Logged in as ${bot.user.tag}!`);

});

// This method will be activated when Firebase is connected.
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

/* 

    If you are looking to develop custom plugins, you can insert everything here.

*/
tinyCfg.web.middleware = function (web, app) {

    // Warn
    console.group('Starting Middleware...');
    console.log(web);
    console.log(app);
    console.groupEnd();

    /// Complete
    return {

        // Socket Plugin
        socket: function (i) {

            /* 
            
            i.io = Socket.IO Module
            i.socket = Socket User from socket.io
            i.ioCache = Socket.IO cache from application
            i.session = User Session from module "cookie-session"
            i.socketUser = User Cache from "i.ioCache"
            i.userData = The Permission Cache used by i.checkPerm();

            i.web.cfg = Some Application Configs
            
            */

            /* 
            
            i.socketUser.checkPerm(4, 'general', botID, guildID);
            This method is used to check the user's permission within the application.

            The first value is the permission number you are looking to verify.
            
            The second value is the priority level you are trying to use for this permission.
            The global value will always be allowed if it is found.
            If you want to allow only one bot, use the value "bot". (Always use a number greater than 1)
            If you want to allow only one guild, use the value "guild". (Always use a number greater than 1)
            If you are looking to obtain a permission value that is at any priority type, use the value "general".   
            
            */

            // User Connected
            console.group('User Connected!');
            console.log(i);
            console.groupEnd();

            // Send Log to All Bot Logs when the value is true
            i.socketUser.sendLog('info', true, `User ID ${i.socket.id} is connected!`);            

            // Disconnected
            i.socket.on('disconnect', (reason) => {
                console.log(reason); // "ping timeout"
                i.socketUser.sendLog('info', true, `User ID ${i.socket.id} is disconnected! Reason: ${reason}`);
            });

        }

    };

};

/* 

Add a User to the Permission List

1 - Basic Access
2 - Moderator Access
3 - Super Moderator Access
4 - Administrator

*/

// Add Global User
ds.addUser('152145019296284672', 4);

// Add More Permissions
ds.addUser('152145019296284672', {

    // Global Permission
    perm: 4,

    // Guild Permission
    guildsPerm: { 'guild_id': 4 },

    // Bot Permission
    botsPerm: { 'bot_id': 4 }


});

// Validate User Session. If the new user permission is 0. The user is disconnected.
ds.validateUserSession('152145019296284672');

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

}).catch(err => { console.error(err); return; });
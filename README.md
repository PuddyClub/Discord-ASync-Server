# Discord Firebase Async Server
This server is used to create sub-servers that will receive or send data to Firebase via a normal NodeJS server.

Example? Firebase's servers always have a small delay to load the script when the server goes without being called for a long time. You can use this server to send a response to Discord-Interactions more quickly and then send the final request to your Firebase server run the rest of the script to send the final response to the Interaction Request.

You can also use this server to access a bot monitoring panel.

Connecting a gateway bot will also allow you to send your interactions via the Discord.JS API.

<hr/>

## JSON Config
You will need to create a JSON file to configure your server.
```json
{
    "firebase": {
      "apiKey": "",
      "databaseURL": "",
      "projectId": "",
      "appId": ""
    },
    "cookieSession": {
      "keys": [
        "",
        ""
      ]
    },
    "discord": {
      "auth": {
        "client_id": "",
        "client_secret": ""
      }
    },
    "web": {
      "slashCommandListener": true,
      "botChecker": true
    },
    "localhost": "localhost:3000",
    "domain": "",
    "crypto": "",
    "token": "",
    "interactionsID": "",
    "tokenURL": ""
  }
  ```

### firebase (Object)
These are the Firebase definitions that will be loaded by the the firebase client module. The module name is "firebase". (This is not the "firebase-admin" module!)

### cookieSession (Object)
Insert all the settings of the cookie-session module here.

### discord (Object)
Authentication settings for your website monitoring your Discord Bots. 
For security reasons, it is recommended that you create an application in Discord exclusively for this function.

### web (Object)
Choose which module features you want to activate.

slashCommandListener - Activate a special URL to receive your bot's interactions via your Firebase server.

botChecker - Activate your bot's monitoring website.

### localhost (String)
Localhost domain that will be used in your server test.

### domain (String)
Domain name of your server.

### crypto (String)
Crypto Key. Enter a value that is at least 32 characters long.

### token (String)
Security token of your Firebase server that is receiving the interactions.

### interactionsID (String)
Special security ID of your URL that will be read by the Discord Interaction API Webhook.

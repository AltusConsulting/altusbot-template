// Copyright (c) 2018 Altus Consulting
// Licensed under the MIT License 

// Portions of this code are licensed and copyright as follows:
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 


// Load env variables 
var env = require('node-env-file');
env(__dirname + '/.env');

// Storage
if (process.env.REDIS_URL) {
    var redisConfig = { "methods": ['custom_storage'], "url": process.env.REDIS_URL };
    var storage = require('botkit-storage-redis')(redisConfig);
    console.log("Using Redis storage at " + process.env.REDIS_URL);
} else {
    var jfsStorage = require('./lib/storage.js');
    var storage = jfsStorage({ path: './jfs' });
    console.log("Using JFS storage at ./jfs");
}

// If the API requires basic authentication uncomment the following lines:
// if (!process.env.API_USERNAME || !process.env.API_PASSWORD) {
//     console.log("No API credentials were provided.");
//     console.log("Please add env variables API_USERNAME and API_PASSWORD on the command line or to the .env file");
//     process.exit(1);
// }

var extAPIConfig = {
    "username": process.env.API_USERNAME,
    "password": process.env.API_PASSWORD,
    "apiToken": process.env.API_TOKEN,
    "baseURL": process.env.API_BASE_URL
};


// We're using the CryptoCompare API as an example. Change the identifiers to match
// the name of your API
var extAPI = require('./lib/externalapi.js')(extAPIConfig);

// Checking if the API is accessible
extAPI.prices.get('btc', 'usd', function(error, price, response) {
    if (response.statusCode == '200') {
        console.log("CryptoCompare API: Using API at " + process.env.API_BASE_URL);
        console.log("CryptoCompare API: REST API credentials OK");
    } else if (response.statusCode == '401') {
        console.log("CryptoCompare API: API credentials are invalid. Please verify credentials and/or token.");
        process.exit(1);
    } else {
        console.log("There was an unknown problem accessing the CryptoCompare API.");
        process.exit(1);
    }
});

//
// BotKit initialization
//

var Altusbot = require('./lib/altusbot.js');

if (!process.env.BOT_TOKEN) {
    console.log("Could not start as bots require a Webex Teams API access token.");
    console.log("Please add env variable BOT_TOKEN on the command line or to the .env file");
    console.log("Example: ");
    console.log("> BOT_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node bot.js");
    process.exit(1);
}

if (!process.env.PUBLIC_URL) {
    console.log("Could not start as this bot must expose a public endpoint.");
    console.log("Please add env variable PUBLIC_URL on the command line or to the .env file");
    console.log("Example: ");
    console.log("> BOT_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node bot.js");
    process.exit(1);
}

var env = process.env.NODE_ENV || "development";

//var controller = Botkit.sparkbot({
var controller = Altusbot({
    log: true,
    public_address: process.env.PUBLIC_URL,
    ciscospark_access_token: process.env.BOT_TOKEN,
    secret: process.env.SECRET, // this is a RECOMMENDED security setting that checks of incoming payloads originate from Webex Teams
    webhook_name: process.env.WEBHOOK_NAME || ('built with BotKit (' + env + ')'),
    storage: storage,
    externalapi: extAPI 
});

var bot = controller.spawn({});


// Load BotCommons properties
bot.commons = {};
bot.commons["healthcheck"] = process.env.PUBLIC_URL + "/ping";
bot.commons["up-since"] = new Date(Date.now()).toGMTString();
bot.commons["version"] = "v" + require("./package.json").version;
bot.commons["owner"] = process.env.owner;
bot.commons["support"] = process.env.support;
bot.commons["platform"] = process.env.platform;
bot.commons["nickname"] = process.env.BOT_NICKNAME || "unknown";
bot.commons["code"] = process.env.code;


// Start Bot API
controller.setupWebserver(process.env.PORT || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log("Webex Teams: Webhooks set up!");
    });

    controller.createAPIEndpoint(webserver, bot, function() {
        console.log("API endpoints set up!");
    });

    // installing Healthcheck
    webserver.get('/ping', function(req, res) {
        res.json(bot.commons);
    });

    // installing Welcome Page
    webserver.get('/', function(req, res) {
        res.send("<html><h2>The Webex Teams bot is running</h2></html>");
    });

    console.log("Webex Teams: healthcheck available at: " + bot.commons.healthcheck);
});

// Load skills
var normalizedPath = require("path").join(__dirname, "lib/skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    try {
        require("./lib/skills/" + file)(controller);
        console.log("Webex Teams: loaded skill: " + file);
    } catch (err) {
        if (err.code == "MODULE_NOT_FOUND") {
            if (file != "utils") {
                console.log("Webex Teams: could not load skill: " + file);
            }
        }
    }
});

// Utility to add mentions if Bot is in a 'Group' space
bot.enrichCommand = function(message, command) {
    var botName = process.env.BOT_NICKNAME || "BotName";
    if ("group" == message.roomType) {
        return "`@" + botName + " " + command + "`";
    }
    if (message.original_message) {
        if ("group" == message.original_message.roomType) {
            return "`@" + botName + " " + command + "`";
        }
    }


    return "`" + command + "`";
}
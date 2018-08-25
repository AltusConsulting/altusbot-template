var Botkit = require('botkit');

function Altusbot(configuration) {

    // Create a Sparkbot
    var controller = Botkit.sparkbot(configuration || {});

    // Create and endpoint to receive notifications
    controller.createAPIEndpoint = function(webserver, bot, cb) {
        webserver.post('/api', function(req, res) {
    
            res.sendStatus(200);
            //controller.handlePayload(req, res, bot);
    
        });
        if (cb) cb();
    };

    // Add the external api to the controller
    if (configuration.externalapi) {
        controller.externalapi = configuration.externalapi;
    }

    return controller;

}

module.exports = Altusbot;
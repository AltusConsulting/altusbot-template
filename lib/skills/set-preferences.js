module.exports = function(controller) {

    controller.hears(['^set pref'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            function setCurrencyPreference(currency, user) {
                controller.storage.users.save({ id: user, currency: currency }, function(err) {
                    console.log("Storage Error: " + err);
                    convo.say("Your currency preference have been set to **{}**.".format(currency.toUpperCase()));
                });
            }

            convo.ask("What's your preferred currency?<br/>\n* **USD**: US Dollars<br/>\n * **EUR**: Euro<br/>\n* **GBP**: Great Britain Pounds<br/>\n* **JPY**: Japanese Yen", [{
                pattern: "USD|usd",
                callback: function(response, convo) {
                    setCurrencyPreference('usd', message.user);
                    convo.next();
                },
            }, {
                pattern: "EUR|eur",
                callback: function(response, convo) {
                    setCurrencyPreference('eur', message.user);
                    convo.next();
                },
            }, {
                pattern: "GBP|gbp",
                callback: function(response, convo) {
                    setCurrencyPreference('gbp', message.user);
                    convo.next();
                },
            }, {
                pattern: "JPY|jpy",
                callback: function(response, convo) {
                    setCurrencyPreference('jpy', message.user);
                    convo.next();
                },
            },{
                default: true,
                callback: function(response, convo) {
                    convo.say("Sorry, I did not understand.");
                    convo.repeat();
                    convo.next();
                }
            }]);

            convo.activate();
        });
    });

};
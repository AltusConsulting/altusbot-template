module.exports = function(controller) {

    controller.hears('get price for (.*)', 'direct_message,direct_mention', function(bot, message) {

        var coin = message.match[1];

        var toCoinName = {
            "btc": "Bitcoin",
            "eth": "Ethereum",
            "xrp": "Ripple",
            "xmr": "Monero",
            "bch": "Bitcoin Cash",
            "etc": "Ethereum Classic",
            "cvc": "Civic",
            "loom": "Loom Coin"
        };

        function showPrice(coin, fiat, convo){
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: fiat,
                minimumFractionDigits: 2,
              });
            controller.externalapi.prices.get(coin, fiat, function(error, price, response) {
                if (price) {
                    convo.say("The current price for **{}** is **{}**".format(toCoinName[coin], formatter.format(price)));
                }
            });
          }

        bot.createConversation(message, function(err, convo) {

            if ((!Object.keys(toCoinName).includes(coin.toLowerCase())) && (coin.toLowerCase() !== "all")) {
                convo.say("Cryptocurrency {} is not yet supported".format(coin));
                convo.next();
            }

            controller.storage.users.get(message.user, function(err, user_data) {
                var fiat = "usd";    
                if (user_data){
                    fiat = user_data.currency;
                }
                if (coin == "all") {
                    Object.keys(toCoinName).forEach(function(coin){
                        showPrice(coin, fiat, convo);
                    });
                } else {
                    showPrice(coin, fiat, convo);
                }
            });

            convo.activate();   
        });
    });


};
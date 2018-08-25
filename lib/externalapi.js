var request = require("request");
var request = request.defaults({jar: false});
const format = require('string-format');
format.extend(String.prototype, {});

module.exports = function(config) {

    // We're using a public API for cryptocurrency prices as an example of 
    // an external API. Documentation at: https://www.cryptocompare.com/api#-api-data-price-
    var cryptoAPI = {
        prices: {
            get: function(coin, fiat, cb) {
                var resource = '/data/price?fsym={}&tsyms={}'.format(coin.toUpperCase(), fiat.toUpperCase());
                request.get(config.baseURL + resource, function(error, response, body) {
                    var data = null;
                    if (body) {
                        console.log(JSON.parse(body)[fiat.toUpperCase()])
                        price = JSON.parse(body)[fiat.toUpperCase()];
                    };
                    cb(error, price, response);
                });

                // If the API uses basic auth, use this instead:
                //request.get(config.baseURL + resource, cb).auth(config.username, config.password);
            }
        }
    };

    return cryptoAPI;
};
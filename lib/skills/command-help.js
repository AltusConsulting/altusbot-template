//
// Command: help
//
module.exports = function(controller) {

    controller.hears(["help", "who"], 'direct_message,direct_mention', function(bot, message) {
        var text = "My skills are:";
        text += "\n- " + bot.enrichCommand(message, "get price for [ usd | eur | gbp | jpy ]") + ": Get current price of a cryptocurrency";
        text += "\n- " + bot.enrichCommand(message, "set preferences") + ": Set your preferred currency to show crypto prices (USD, EUR, GBP, JPY)";

        text += "\n\nI also understand:";
        text += "\n- " + bot.enrichCommand(message, ".commons") + ": shows metadata about myself";
        text += "\n- " + bot.enrichCommand(message, "help") + ": spreads the message about my skills";
        bot.reply(message, text);
    });
}
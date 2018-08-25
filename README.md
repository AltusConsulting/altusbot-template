# Webex Teams Bot Template Using BotKit

Inspired by [BotKit samples for Webex Teams](https://github.com/CiscoDevNet/botkit-webex-samples) by Stève Sfartz <mailto:stsfartz@cisco.com>

## Instructions for deployment

Either if you deploy locally or to Heroku, you'll need to perform these two tasks first:

1. Create a Bot Account from the ['Webex for developers' bot creation page](https://developer.webex.com/add-bot.html), and copy your bot's access token.

## Heroku deployment

Click below to quickly deploy the bot to Heroku. You will need the following information:
* Your Bot token
* Your public URL (for a Heroku deployment this would be `https://{app-name}.herokuapp.com`, where `{app-name}` is the name you chose for your Heroku app).

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Local deployment

1. Choose your storage type. You have two options: local storage using [JSON File Store (JFS)](https://www.npmjs.com/package/jfs) or [Redis](https://redis.io/), a NO-SQL, in-memory data structure store. If you choose to use JFS, you don't have to install anything yourself. If you choose to use Redis you'll need to [download](https://redis.io/download) and install it on your local machine, with the default settings (port 6379).

1. [Optional] Webex Teams uses a webhook to send incoming messages to your bot, but webhooks require a public IP address. If you don't have one, you can use [ngrok](https://ngrok.com) to create a tunnel to your machine. Launch ngrok to expose port 3000 of your local machine to the internet:

    ```shell
    ngrok http 3000
    ```

    Pick the HTTPS address that ngrok is now exposing. Note that ngrok exposes HTTP and HTTPS protocols, make sure to pick the HTTPS address.

1. [Optional] Open the `.env` file and modify the settings to accomodate your bot.

    _Note that you can also specify any of these settings via env variables. In practice, the values on the command line or in your machine env will prevail over .env file settings. In the example below, we do not modify any value in settings and specify all configuration values on the command line._

1. You're ready to run your bot

From a bash shell, type:

```shell
> git clone https://github.com/AltusConsulting/altusbot-template.git
> cd altusbot-template
> npm install
> BOT_TOKEN=0123456789abcdef PUBLIC_URL=https://abcdef.ngrok.io SECRET="not that secret" API_BASE_URL=https://exampleapi.com node bot.js
```

If you're using Redis, this last command would be:

```shell
> BOT_TOKEN=0123456789abcdef PUBLIC_URL=https://abcdef.ngrok.io SECRET="not that secret" API_BASE_URL=https://exampleapi.com REDIS_URL=redis://localhost:6379/1 node bot.js
```

From a windows shell, type:

```shell
> git clone https://github.com/AltusConsulting/altusbot-template.git
> cd altusbot-template
> npm install
> set BOT_TOKEN=0123456789abcdef
> set PUBLIC_URL=https://abcdef.ngrok.io
> set SECRET=not that secret
> set API_BASE_URL=https://exampleapi.com
> node bot.js
```

If you're using Redis, you'll need to add an additional environment variable before launching the bot:

```shell
> set REDIS_URL=redis://localhost:6379/1
```

where:

- BOT_TOKEN is the API access token of your Webex Teams bot.
- PUBLIC_URL is the root URL at which Webex Teams can reach your bot. If you're using ngrok, this should be the URL ngrok exposes when you run it. 
- SECRET is the secret that Webex Teams uses to sign the JSON webhooks events posted to your bot.
- API_BASE_URL is the base URL of your external API (if any)
- REDIS_URL is the URL of the Redis instance you installed.


### Testing your bot

To test that your bot is online, add it to your Webex Teams account as you will add any other contact and ask the bot for help with the `help` command.

This particular bot retrieves crytocurrency prices from the [CryptoCompare API](https://www.cryptocompare.com/api#-api-data-price-). Type `get price for <cryptocurrency>` where `cryptocurrency` could be any of the following cryptos: btc (Bitcoin), eth (Ethereum), xrp (Ripple), xmr (Monero), bch (Bitcoin Cash), etc (Ethereum Classic), cvc (Civic), loom (Loom Coin). This showcases the use of an external API to retrieve information.

You can also set your preferred currency to show the results (USD, EUR, GBP or JPY) with the command `set preferences`. This showcases the use of local storage (either JFS or Redis) to store user data.
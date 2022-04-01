# Gallifreyan Translation Helper Discord Bot
###### by MightyFrong

This bot is an extension to the Gallifreyan Translation Helper, with the purpose of making it usable directly inside of Discord Chats.
See [the GTH GitHub](https://github.com/Mightyfrong/gallifreyan-translation-helper) for more information.

---
## User Guide

### Commands

These commands are currently supported:

* changePrefix {newPrefix}: Changes the prefix to call the bot
* guides, guide, language, alphabets: Links to [the r/gallifreyan wiki guide list](https://www.reddit.com/r/gallifreyan/wiki/language#wiki_incomplete_list_of_all_gallifreyan_alphabets)
* help: Displays this
* ping: Pong!
* translate {language} [text]: Sends image of translation
* translator: Links to [the GTH](https://mightyfrong.github.io/gallifreyan-translation-helper/)

## Dev Guide

To run the app:

1. Register an app and a user for the bot at the [Discord Developer Portal](https://discord.com/developers).
2. Create `json` files corresponding to each template given in `/data/`.
3. Under the "Bot" section, find the login token for your bot user and copy to clipboard.
4. Paste the token into the `token.json` file you made in step 2.
5. Run the bot using `npm start`.

### Web Service Integration

The "translate" command supports a demo lang called "hello" which calls the [GTH web API](https://github.com/ModisR/gth-web-api), whose goal is to eventually provide a common point of entry to translation services for the this bot and the [GTH web page](https://github.com/Mightyfrong/gallifreyan-translation-helper).

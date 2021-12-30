import { logger } from './utils.js';
import settingsManager from './settingsManager.js';
import { createRequire } from 'module'
const require = createRequire(import.meta.url);
const fs = require('fs');

//importing commands
import { changePrefix } from './commands/changePrefix.js';
import { guides } from './commands/guides.js';
var guide = guides;
var language = guides;
var alphabets = guides;
import { help } from './commands/help.js';
import { ping } from './commands/ping.js';
import { translate } from './commands/translate.js';
import { translator } from './commands/translator.js';

var gth = translator;

const commands = { changePrefix, guides, guide, language, alphabets, help, ping, translate, translator, gth };

//checks and passes commands to their respective files
export async function commandHandler(msg) {
	if (msg.author.bot) return;
	if (permChannel(msg)) {
		const [prefix, command, ...tokens] = msg.content.split(" ");

		if (talkingToMe(msg, prefix)) {
			logger("Command: " + command);
			try {
				commands[command](msg, tokens);
			}
			catch (err) {
				logger('Does not exist');
				msg.reply("Sorry. I don't know that command.");
			}
		}
	}
}

//checks if channel is blacklisted
function permChannel(msg) {
	let rawdata = fs.readFileSync('./data/blacklist.json');
	let blacklist = JSON.parse(rawdata);
	for (var i = 0; i < blacklist.server.length; i++) {
		if (blacklist.server[i].id == msg.guild.id) {
			for (var j = 0; j < blacklist.server[i].channels.length; j++) {
				if (blacklist.server[i].channels[j].id == msg.channel.id) {
					logger("channel blacklisted");
					return false;
				}
			}
		}
	}
	logger("channel ok");
	return true;
}

//checks the prefix
function talkingToMe(msg, token) {
	const msgServer = settingsManager.findServerBy(msg.guild.id);
	const prefix = msgServer ? msgServer.prefix : "!gth";

	return token === prefix;
}

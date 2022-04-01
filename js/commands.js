import { logger } from './utils.js';
import config from './services/configuration.js';
import settingsManager from './services/settingsManager.js';

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
function permChannel({ guild, channel }) {
	const server = config.blacklist.find(({ serverId }) => serverId == guild.id);
	const isBlacklisted = server && server.channelIds.includes(channel.id);

	if (isBlacklisted) {
		logger("channel blacklisted");
		return false;
	} else {
		logger("channel ok");
		return true;
	}
}

//checks the prefix
function talkingToMe(msg, token) {
	const msgServer = settingsManager.findServerBy(msg.guild.id);
	const prefix = msgServer ? msgServer.prefix : "!gth";

	return token === prefix;
}

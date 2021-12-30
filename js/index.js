import Discord from 'discord.js';

import config from './services/configuration.js';
import { logger } from './utils.js';
import { commandHandler } from './commands.js'

logger('Starting Bot...');
const client = new Discord.Client();

client.on('ready', () => {
	logger(`Logged in as ${client.user.tag}!`);
});

//listen for messages
client.on('message', commandHandler);

client.on('warn', (info) => {
	logger('[Warn]' + info)
});
client.on('error', (error) => {
	logger('[ERROR]' + error)
});

//bot login
client.login(config.token);

import { readFileSync } from 'fs';
import Discord from 'discord.js';

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

let rawdata = readFileSync('./data/token.json');
let token = JSON.parse(rawdata);
client.login(token.token);

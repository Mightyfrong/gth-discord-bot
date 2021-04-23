import { logger } from './utils.js'
logger('Starting Bot...');

import { createRequire } from 'module'
const require = createRequire(import.meta.url);
const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();

client.on('ready', () => {
  logger(`Logged in as ${client.user.tag}!`);
});

//listen for messages
import { commandHandler } from './commands.js'
client.on('message', commandHandler);

client.on('warn', (info) => {
  logger('[Warn]' + info)
});
client.on('error', (error) => {
  logger('[ERROR]' + error)
});

//bot login
let rawdata = fs.readFileSync('../data/token.json');
let token = JSON.parse(rawdata);
client.login(token.token);

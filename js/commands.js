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

const commands = { changePrefix, guides, guide, language, alphabets, help, ping, translate, translator }; 

//checks and passes commands to their respective files
export async function commandHandler(msg) {
    if (msg.author.bot) return;
    if (permChannel(msg)) {
        let tokens = msg.content.split(" ");
        let prefix = tokens.shift();
        let command = tokens.shift();
        if (talkingToMe(msg, prefix)) {
            console.log("Command: " + command);
            try {
                commands[command](msg, tokens);
            }
            catch (err) {
                console.log('Does not exist');
                msg.reply("Sorry. I don't know that command.");
            }
        }
    }
}

//checks if channel is blacklisted
function permChannel(msg) {
    let rawdata = fs.readFileSync('../data/blacklist.json');
    let blacklist = JSON.parse(rawdata);
    for (var i = 0; i < blacklist.server.length; i++) {
        if (blacklist.server[i].id == msg.guild.id) {
            for (var j = 0; j < blacklist.server[i].channels.length; j++) {
                if (blacklist.server[i].channels[j].id == msg.channel.id) {
                    console.log("channel blacklisted");
                    return false;
                }
            }
        }
    }
    console.log("channel ok");
    return true;
}

//checks the prefix
function talkingToMe(msg, token) {
    let prefix = "!gth";
    let rawdata = fs.readFileSync('../data/settings.json');
    let settings = JSON.parse(rawdata);
    for (var i = 0; i < settings.server.length; i++) {
        if (settings.server[i].id == msg.guild.id) {
            prefix = settings.server[i].prefix;
            break;
        }
    }
    return token === prefix;
}

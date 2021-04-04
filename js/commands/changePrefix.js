const permLevel = 3;
import { permUser } from '../utils.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');

export async function changePrefix (msg, tokens) {
    if (await permUser(msg, permLevel)) {
        setPrefix(msg, tokens);
        msg.reply("Prefix for this server changed to  " + tokens[0]);
    }
}

function setPrefix(msg, tokens) {
    let rawdata = fs.readFileSync('../data/settings.json');
    let settings = JSON.parse(rawdata);
    for (var i = 0; i < settings.server.length; i++) {
        if (settings.server[i].id == msg.guild.id) {
            var server = settings.server[i];
        }
    }
    if (!server) {
        server = settings.server.push({ "id": msg.guild.id, "prefix": tokens[0] });
    }
    else {
        server.prefix = tokens[0];
    }
    let data = JSON.stringify(settings);
    fs.writeFileSync('../data/settings.json', data);
}

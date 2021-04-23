const permLevel = 1;
import { permUser } from '../utils.js';

//links the wiki guide list
export async function guides (msg, tokens) {
    if (await permUser(msg, permLevel)) {
        msg.reply('https://www.reddit.com/r/gallifreyan/wiki/language');
    }
}

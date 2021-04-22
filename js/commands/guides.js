const permLevel = 1;
import { permUser } from '../utils.js';

export async function guides (msg, tokens) {
    if (await permUser(msg, permLevel)) {
        msg.reply('https://www.reddit.com/r/gallifreyan/wiki/language');
    }
}

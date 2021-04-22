const permLevel = 1;
import { permUser } from '../utils.js';

export async function translator (msg, tokens) {
    if (await permUser(msg, permLevel)) {  
        msg.reply('https://mightyfrong.github.io/gallifreyan-translation-helper/');
    }
}

const permLevel = 2;
import { permUser } from '../utils.js';

export async function translate (msg, tokens) {
    if (await permUser(msg, permLevel)) {
        //custom code here
        msg.reply("Sorry. I can't do that yet.");
    }
}
const permLevel = 1;
import { permUser } from '../utils.js';

//Pong!
export async function ping (msg, tokens) {
    if (await permUser(msg, permLevel)) {
        msg.reply("Pong!");
    }
}

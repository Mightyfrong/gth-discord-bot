const permLevel = 1;
import { permUser } from '../utils.js';

export async function command_template (msg, tokens) {
    if (permUser(msg, permLevel)) {
        //custom code here
        msg.reply("_TEMPLATE_");
    }
}
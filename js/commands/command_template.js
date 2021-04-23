const permLevel = 1;
import { permUser } from '../utils.js';

//TEMPLATE for new command creation
export async function command_template (msg, tokens) {
    if (await permUser(msg, permLevel)) {
        //custom code here
        msg.reply("_TEMPLATE_");
    }
}

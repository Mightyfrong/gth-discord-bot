const permLevel = 1;
import { permUser } from '../utils.js';

//Display supported commands
export async function help (msg, tokens) {
    if (await permUser(msg, permLevel)) {
        msg.channel.send(
`These commands are currently supported:

changePrefix {newPrefix}: Changes the prefix to call the bot
guides: Links to the r/gallifreyan wiki guide list
help: Displays this
ping: Pong!
translate {language} [text]: Sends image of translation
translator: Links to the GTH`
        );
    }
}

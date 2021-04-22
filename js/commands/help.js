const permLevel = 1;
import { permUser } from '../utils.js';

export async function help (msg, tokens) {
    if (await permUser(msg, permLevel)) {
        msg.channel.send(
`These commands are currently supported:

changePrefix: Changes the prefix to call the bot
guides: Links to the r/gallifreyan wiki guide list
help: Displays this
ping: Pong!
translate: Does not currently work
translator: Links to the GTH`
        );
    }
}

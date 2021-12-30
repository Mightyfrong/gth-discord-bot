import { permUser } from '../utils.js';
import settingsManager from '../services/settingsManager.js';

const permLevel = 3;

//changes the prefix on the specific server
export async function changePrefix(msg, [prefix, ..._]) {
	permUser(msg, permLevel)
		.then(userPerm => {
			if (userPerm) {
				settingsManager.setPrefix(msg.guild.id, prefix);
				msg.reply("Prefix for this server changed to  " + prefix);
			}
		});
}

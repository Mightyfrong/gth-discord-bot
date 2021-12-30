import { readFileSync, writeFileSync } from 'fs';

const settingsFile = './data/settings.json';

class SettingsManager {
	constructor() {
		this.settings = JSON.parse(readFileSync(settingsFile));
	}

	findServerBy(serverId) {
		return this.settings.server.find(({ id }) => id == serverId);
	}

	setServer(id, prefix) {
		let server = this.findServerBy(id);

		if (server) {
			server.prefix = prefix; 
		}	else {
			this.settings.server.push({ id, prefix });
		}

		writeFileSync(settingsFile, JSON.stringify(this.settings));
	}
}

export default new SettingsManager;
import * as fs from 'fs';

import config from './configuration.js';

class SettingsManager {
	constructor(config) {
		this.file = config.settings;
		this.settings = JSON.parse(fs.readFileSync(this.file));
	}

	findServerBy(serverId) {
		return this.settings.server.find(({ id }) => id == serverId);
	}

	setPrefix(id, prefix) {
		let server = this.findServerBy(id);

		if (server) {
			server.prefix = prefix;
		} else {
			this.settings.server.push({ id, prefix });
		}

		fs.writeFileSync(this.file, JSON.stringify(this.settings));
	}
}

export default new SettingsManager(config);


const merge = require('webpack-merge');

module.exports = function configModes (configCb) {
	return env => {
		const mode = {
			dev:   (env == 'dev'),
			prod:  (env == 'prod'),
			short: env || 'none',
			long: {
				dev:  'development',
				prod: 'production'
			}[env] || 'none'
		};

		const config = configCb(mode);

		return merge(
			{ mode: mode.long },
			config.common,
			config[mode.long]
		);
	};
};

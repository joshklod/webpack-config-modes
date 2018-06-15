
const merge = require('webpack-merge');

module.exports = function configModes (configArg) {
	return env => {
		const mode = {
			dev:   (env == 'dev'),
			prod:  (env == 'prod'),
			short: (['dev', 'prod'].includes(env)) ? env : 'none',
			long: {
				dev:  'development',
				prod: 'production'
			}[env] || 'none'
		};

		var config;
		if (typeof configArg == 'function')
			config = configArg(mode);
		else if (typeof configArg == 'object' && !Array.isArray(configArg))
			config = configArg;
		else {
			throw new TypeError('Argument must be an object or a function ' +
				'of the form: `mode => object`');
		}

		return merge(
			{ mode: mode.long },
			config.common,
			config[mode.long]
		);
	};
};

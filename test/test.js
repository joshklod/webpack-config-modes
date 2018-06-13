const {inspect} = require('util');

const configModes = require(process.cwd());

const args = process.argv.slice(2);

function runTest (config, env) {
	// This is the output of this module, which is fed to module.exports of
	// webpack.config.js
	const webpackConfig = configModes(config);

	// Simulate webpack config resolution
	return webpackConfig(env);
}

// Get tests to perform from command-line arguments
var test = {
	configs: false,
	modes: false
}
if (args.includes('all') || args.length == 0) {
	for (key in test)
		test[key] = true;
} else {
	args.forEach(arg => {
		test[arg] = true;
	});
}

// Test different config argument types (`configModes(<config>)`)
if (test.configs) {
	const configs = [
		{ common: {type: 'object'} },
		mode => ({
			common: { type: 'function' }
		})
	];
	configs.forEach(config => {
		const result = runTest(config);
		console.log(inspect({
			config: (Array.isArray(config) ? 'array' : typeof config),
			result
		}));
	});
}

// Test for proper resolution of mode arguments
if (test.modes) {
	const config = mode => ({
		common: {
			entry: 'src/file.js',
			output: 'dist/file.js',
			prod: `We are ${mode.prod ? '' : 'not '}in production mode!`,
			dev: `We are ${mode.dev ? '' : 'not '}in development mode!`
		},
		production: {
			output: 'dist/file.min.js'
		},
		development: {
			output: 'dist/file.dev.js'
		}
	});
	const modes = [
		'dev',
		'prod',
		'unknown',
		'',
		undefined
	];
	modes.forEach(mode => {
		const result = runTest(config, mode);
		console.log(inspect({
			mode,
			result
		}));
	});
}

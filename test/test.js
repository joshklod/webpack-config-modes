'use strict';

const {inspect} = require('util');

const configModes = require(process.cwd());

const args = process.argv.slice(2);

function initObject (propNames, value = undefined) {
	var result = {};
	propNames.forEach(name => result[name] = value);
	return result;
}

// Tests to perform
const testNames = [
	'configs',
	'modes'
];
// Enable all tests for `npm test` by checking for 0 arguments
var test = initObject(testNames, (args.length == 0) ? true : false);

// Process command-line arguments
args.forEach(arg => {
	switch (arg) {
		case 'all':
			for (const key in test)
				test[key] = true;
			break;
		default:
			test[arg] = true;
	}
});

const defaultConfig = mode => ({
	common: {
		using: 'default',
		meta: mode
	},
	production: {
		using: 'production'
	},
	development: {
		using: 'development'
	}
});

function runTest (config = defaultConfig, env) {
	// This is the output of this module, which is fed to module.exports of
	// webpack.config.js
	const webpackConfig = configModes(config);

	// Simulate webpack config resolution
	return webpackConfig(env);
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
	const modes = [
		'dev',
		'prod',
		'unknown',
		'',
		undefined
	];
	modes.forEach(mode => {
		const result = runTest(undefined, mode);
		console.log(inspect({
			mode,
			result
		}));
	});
}

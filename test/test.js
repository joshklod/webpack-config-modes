'use strict';

const {inspect} = require('util');
const {Console} = require('console');

const configModes = require(process.cwd());

const args = process.argv.slice(2);

function initObject (propNames, value = undefined) {
	var result = {};
	propNames.forEach(name => result[name] = value);
	return result;
}

class Logger extends Console {
	pretty () {
		for (const obj of arguments) {
			this.log(inspect(obj, {
				depth: null,
				colors: true
			}));
		}
	}
	group (label) {
		this.pretty(label);
		super.group();
	}
	grouped (label, ...args) {
		this.group(label);
		this.pretty.apply(this, args);
		this.groupEnd();
	}
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
			if (testNames.includes(arg)) {
				test[arg] = true;
				break;
			}
			console.error(`Error: Unknown argument: '${arg}'`);
			process.exit(1);
	}
});

const log = new Logger(process.stdout, process.stderr);

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
		const configType =
			`[${Array.isArray(config) ? 'array' : typeof config}]`;
		log.grouped(configType, result);
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
		log.grouped(mode, result);
	});
}

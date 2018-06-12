const configModes = require(process.cwd());

// This is module.exports of webpack.config.js
const webpackConfig = configModes(mode => ({
	common: {
		entry: 'src/file.js',
		output: 'dist/file.js'
	},
	production: {
		output: 'dist/file.min.js'
	},
	development: {
		output: 'dist/file.dev.js'
	}
}));

// List of possible inputs for `webpack --env <mode>`
const modes = [
	'dev',
	'prod',
	'unknown',
	'',
	undefined
];

// Simulate webpack for each mode in list
const result = modes.map(env => ({
	env,
	result: webpackConfig(env)
}));

console.log(result);

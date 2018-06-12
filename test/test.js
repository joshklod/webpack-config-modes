const configModes = require(process.cwd());

const args = process.argv.slice(2);

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

// List of possible module arguments (`configModes(<config>)`)
var configs = [];
if (test.configs) {
	configs.push(
		{ common: {type: 'object'} },
		mode => ({
			common: { type: 'function' }
		})
	);
}
if (test.modes) {
	configs.push(mode => ({
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
	}));
}

// List of possible inputs for `webpack --env <mode>`
var modes;
if (test.modes) {
	modes = [
		'dev',
		'prod',
		'unknown',
		'',
		undefined
	];
} else {
	modes = ['dev'];
}

// Generate array of test parameters
const tests = configs.reduce(
	(arr, conf) => arr.concat(modes.map(mode => ({conf, mode}))),
	[]
);

const results = tests.map(({conf, mode}) => {
	// This is the output of this module, which is fed to module.exports of
	// webpack.config.js
	const webpackConfig = configModes(conf);

	// Simulate webpack config resolution
	const env = mode;
	const result = webpackConfig(env);

	return {
		test: {
			conf: (Array.isArray(conf) ? 'array' : typeof conf),
			mode
		},
		result
	};
});

console.log(require('util').inspect(results));

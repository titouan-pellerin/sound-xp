//@ts-nocheck
import fs from 'fs';
import path, { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

import glsl from 'vite-plugin-glsl';
import handlebars from 'vite-plugin-handlebars';
import ifdef from './ifdef/ifdefRollupPlugin.js';
import rollupOptions from './rollup.config.js';

const translation = JSON.parse(fs.readFileSync(resolve(__dirname, '../src/assets/langs/en.json')).toString());
const partialDirectory = getDirectoriesRecursive(resolve(__dirname, '../src/views'));

export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	process.stdout.write('\n\x1b[2mv' + process.env.npm_package_version + '\x1b[22m\n');
	process.stdout.write('\n🏁 Project : ' + process.env.npm_package_name);
	process.stdout.write('\n🪲  Environnement : ' + mode);
	process.stdout.write('\n🚧 DEBUG is : ' + env.VITE_DEBUG + '\n\n');

	return defineConfig({
		server: {
			port: 8080,
			https: false,
			open: false,
			host: true,
			hmr: { port: 8081 },
			watch: {
				usePolling: true,
			},
		},
		plugins: [
			glsl(),
			ifdef({ DEBUG: env.VITE_DEBUG === 'true' }),
			handlebars({
				partialDirectory,
				helpers: {
					svg: (params) => {
						return fs.readFileSync(resolve(__dirname, '../src/assets/svgs/' + params.hash.name + '.svg'), 'utf8').replace('<svg ', `<svg class="${params.hash.classes || ''}" `);
					},
					arrayFrom: (...params) => {
						params.pop();
						return params;
					},
				},
				context() {
					return translation;
				},
			}),
		],
		resolve: {
			alias: [
				{ find: 'scripts', replacement: '/src/scripts' },
				{ find: 'assets', replacement: '/src/assets' },
				{ find: 'styles', replacement: '/src/styles' },
				{ find: 'views', replacement: '/src/views' },
				{ find: 'Shared', replacement: '/src/scripts/Shared' },
				{ find: 'Core', replacement: '/src/scripts/Core' },
				{ find: 'Dom', replacement: '/src/scripts/Dom' },
				{ find: 'Debug', replacement: '/src/scripts/Debug' },
				{ find: 'Tools', replacement: '/src/scripts/Tools' },
				{ find: 'utils', replacement: '/src/scripts/utils' },
				{ find: 'vendors', replacement: '/src/scripts/vendors' },
				{ find: 'Webgl', replacement: '/src/scripts/Webgl' },
			],
			extensions: ['.cjs', '.mjs', '.js', '.ts', '.json'],
		},
		build: {
			rollupOptions,
		},
		appType: 'spa',
	});
};

function flatten(lists) {
	return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
	return fs
		.readdirSync(srcpath)
		.map((file) => path.join(srcpath, file))
		.filter((path) => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath) {
	return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}

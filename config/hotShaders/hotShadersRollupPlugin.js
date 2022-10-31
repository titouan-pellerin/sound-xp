import path from 'path';
import loadShader from './loadShader.js';

const TYPES = {
	'.glsl': 'fragmentShader',
	'.frag': 'fragmentShader',
	'.fs': 'fragmentShader',
	'.vert': 'vertexShader',
	'.vs': 'vertexShader',
};

const EXTS = Object.keys(TYPES).reduce((p, v) => ((p[v] = true), p), {});

const DEFAULT_EXTENSION = 'glsl';

const hotShaderPath = '/config/hotShaders/hotShader.js';

export default function ({ isDev = false, warnDuplicatedImports = true, defaultExtension = DEFAULT_EXTENSION, compress = false, root = '/' } = {}) {
	return {
		name: 'vite-glsl-plugin',
		// config: () => (),
		config() {
			return { resolve: { extensions: Object.keys(EXTS) } };
		},
		transform: async (src, id) => {
			const split = path.extname(id).split('?');
			const ext = split[0];
			if (!EXTS[ext]) return;

			const params = new URLSearchParams(split[1]);
			const isHot = params.has('hotshader');

			let code = loadShader(src, id, {
				warnDuplicatedImports,
				defaultExtension,
				compress: compress && !isDev,
				root,
			});

			if (isHot) {
				const type = TYPES[ext];
				code = [`import hotShader from "${hotShaderPath}";`, '', `const shader = ${JSON.stringify(code)};`, '', `export default hotShader(shader, "${type}", update => {`, `	if (import.meta.hot) import.meta.hot.accept(update);`, `});`].join('\n');
			} else {
				code = `export default ${JSON.stringify(code)};`;
			}

			return {
				code,
				map: null,
			};
		},
	};
}

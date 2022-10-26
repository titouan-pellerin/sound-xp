import path from 'path';

const TYPES = {
	'.glsl': 'fragmentShader',
	'.frag': 'fragmentShader',
	'.fs': 'fragmentShader',
	'.vert': 'vertexShader',
	'.vs': 'vertexShader',
};

const EXTS = Object.keys(TYPES).reduce((p, v) => ((p[v] = true), p), {});

const hotShaderPath = '/config/hotShaders/hotShader.js';

export default function (isDev) {
	return {
		name: 'rollup-glsl-plugin',
		config: () => ({ resolve: { extensions: Object.keys(EXTS) } }),
		transform: async (src, id) => {
			const split = path.extname(id).split('?');
			const ext = split[0];
			if (!EXTS[ext]) return;

			const params = new URLSearchParams(split[1]);
			const isHot = params.has('hotshader');
			let code = src;

			// Minify only on build
			if (!isDev) {
				// Simple minification by triming
				code = code
					.trim()
					.replace(/\r/g, '')
					.replace(/[ \t]*\/\/.*\n/g, '') // remove //
					.replace(/[ \t]*\/\*[\s\S]*?\*\//g, '') // remove /* */
					.replace(/\n{2,}/g, '\n') // # \n+ to \n
					.replace(/\t/g, ''); // remove \t
			}

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

// @ts-nocheck
import path from 'path';
import { parse } from './preprocessor.js';

const noop = () => true;

const EXTS = ['.cjs', '.jsx', '.js', '.mjs'].reduce((p, v) => ((p[v] = true), p), {});

let test = false;
export default function ifdefRollupPlugin(defines) {
	if (!defines) defines = {};
	if (!test) test = noop;

	return {
		name: 'rollup-ifdef-plugin',
		enforce: 'pre',
		async transform(src, id) {
			if (!test(id)) return;
			const ext = path.extname(id).split('?v')[0];
			if (!EXTS[ext]) return;

			const verbose = false;
			const tripleSlash = true;
			const fillWithBlanks = true;
			const filePath = id;

			const source = parse(src, defines, verbose, tripleSlash, filePath, fillWithBlanks);

			return {
				code: source,
				map: null,
			};
		},
	};
}

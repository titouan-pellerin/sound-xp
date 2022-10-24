import { DEBUG } from 'utils/config.js';
import { hotMaterial } from 'utils/misc.js';
import fs from './fragment.fs';
import vs from './vertex.vs';

export default hotMaterial(
	vs,
	fs,
	(update) => {
		if (import.meta.hot) import.meta.hot.accept(update);
	},
	DEBUG,
);

import { RawShaderMaterial } from 'three';

import fs from './fragment.fs?hotshader';
import vs from './vertex.vs?hotshader';

export default class InstancedCubeMaterial extends RawShaderMaterial {
	constructor(options) {
		super(options);
		fs.use(this);
		vs.use(this);
	}
}

import { ShaderMaterial } from 'three';
import fs from './fragment.fs?hotshader';
import vs from './vertex.vs?hotshader';

export default class PostProcessingMaterial extends ShaderMaterial {
	/**
	 *
	 * @param {import("three").ShaderMaterialParameters} options
	 */
	constructor(options = {}) {
		super(options);
		fs.use(this);
		vs.use(this);
	}
}

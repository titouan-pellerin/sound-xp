import { ShaderMaterial } from 'three';
import hotShader from './hotShader.js';

export default class PostProcessingMaterial extends ShaderMaterial {
	/**
	 *
	 * @param {import("three").ShaderMaterialParameters} options
	 */
	constructor(options = {}) {
		super(options);
		hotShader.use(this);
	}
}

import app from 'scripts/App.js';
import state from 'scripts/State.js';
import { HalfFloatType, MathUtils } from 'three';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
import globalUniforms from 'utils/globalUniforms.js';
import musicUniforms from 'utils/musicUniforms.js';
import velocityFragmentShader from 'Webgl/Material/FBO/velocity.fs';

export default class FBO {
	constructor({ renderer, countSqrt }) {
		state.register(this);

		this.gpuCompute = new GPUComputationRenderer(countSqrt, countSqrt, renderer);
		if (renderer.capabilities.isWebGL2 === false) this.gpuCompute.setDataType(HalfFloatType);

		// Create and fill data textures
		this._positionDataTexture = this.gpuCompute.createTexture();
		this._velocityDataTexture = this.gpuCompute.createTexture();

		this._fillDataTextures();

		// Init variables and dependencies
		// this._positionVariable = this.gpuCompute.addVariable('uPosition', positionFragmentShader, this._positionDataTexture);
		this._velocityVariable = this.gpuCompute.addVariable('uVelocity', velocityFragmentShader, this._velocityDataTexture);

		// this.gpuCompute.setVariableDependencies(this._positionVariable, [this._positionVariable, this._velocityVariable]);
		this.gpuCompute.setVariableDependencies(this._velocityVariable, [this._velocityVariable]);

		// Set uniforms
		// this._positionUniforms = this._positionVariable.material.uniforms;
		this._velocityUniforms = this._velocityVariable.material.uniforms;

		// this._setPositionUniforms();
		this._setVelocityUniforms();

		const error = this.gpuCompute.init();
		if (error) console.error(error);
	}

	_fillDataTextures() {
		const posArr = this._positionDataTexture.image.data;
		const velArr = this._velocityDataTexture.image.data;

		const radius = 0.1;

		for (let i = 0; i <= posArr.length; i += 4) {
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.random() * Math.PI * 2;

			const x = Math.cos(theta) * Math.sin(phi) * (radius + MathUtils.randFloatSpread(0.05));
			const y = Math.sin(theta) * Math.sin(phi) * (radius + MathUtils.randFloatSpread(0.05));
			const z = Math.cos(phi) * (radius + MathUtils.randFloatSpread(0.05));

			const w = Math.random();

			posArr[i + 0] = x;
			posArr[i + 1] = y;
			posArr[i + 2] = z;
			posArr[i + 3] = w;

			velArr[i + 0] = x;
			velArr[i + 1] = y;
			velArr[i + 2] = z;
			velArr[i + 3] = w;
		}
	}

	_setPositionUniforms() {}

	_setVelocityUniforms() {
		this._velocityUniforms['uPosition'] = { value: this._positionDataTexture };
		Object.assign(this._velocityUniforms, globalUniforms, musicUniforms);
	}

	onAttach() {
		app.debug.pane.add(this, 'FBO', 0);
	}

	getCurrentTexture() {
		return this.gpuCompute.getCurrentRenderTarget(this._velocityVariable).texture;
	}

	onTick() {}

	onRender() {
		this.gpuCompute.compute();
	}
}

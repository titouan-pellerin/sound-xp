import app from 'scripts/App.js';
import state from 'scripts/State.js';
import { CUBES } from 'utils/config.js';
import globalUniforms from 'utils/globalUniforms.js';
import FBO from './FBO.js';
import MainCamera from './MainCamera.js';
import MainScene from './MainScene.js';

import PostProcessing from './PostProcessing.js';
import Renderer from './Renderer.js';

export default class {
	constructor() {
		state.register(this);

		this._isAttached = false;

		this.renderer = new Renderer();
		this.postProcessing = new PostProcessing(this.renderer.capabilities.isWebGL2);
		this.scene = new MainScene();
		this.camera = new MainCamera();

		this.fbo = new FBO({ renderer: this.renderer, countSqrt: CUBES.countSqrt });
	}

	onAttach() {
		this._isAttached = true;
		app.$wrapper.prepend(this.renderer.domElement);
	}

	onResize() {}

	onTick({ et, dt }) {
		globalUniforms.uTime.value = et;
		globalUniforms.uDelta.value = dt;
	}

	onRender() {
		if (!this._isAttached) return;
		this.renderer.clear();

		app.webgl.renderer.setRenderTarget(this.postProcessing.renderTarget);
		app.webgl.renderer.clear();
		app.webgl.renderer.render(this.scene, this.camera);
		app.webgl.renderer.setRenderTarget(null);

		this.renderer.render(this.postProcessing.quad, this.postProcessing.camera);
	}
}

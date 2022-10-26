import app from 'scripts/App.js';
import { PerspectiveCamera, Vector2 } from 'three';
import stateMixin from 'utils/stateMixin.js';

const BASE_FOV = 45;

/** @extends PerspectiveCamera */
export default class extends stateMixin(PerspectiveCamera) {
	constructor() {
		super(BASE_FOV, app.tools.viewport.ratio, 1, 1000);
		this._parallaxIntensity = 1;

		this._decay = new Vector2();
		this._lDecay = new Vector2();

		this._position = this.position.clone();
		this._position.z = 20;
		this._quaternion = this.quaternion.clone();
	}

	onAttach() {
		app.debug?.pane.add(this, 'MainCamera', 0);
	}

	onResize({ ratio }) {
		this.aspect = ratio;
		this.fov = BASE_FOV / Math.min(1, ratio * 1.5);
		this.updateProjectionMatrix();
	}

	onTick({ dt }) {
		if (this.orbitControls) return;

		this._lDecay.lerp(this._decay, 4 * dt);

		this.position.copy(this._position);
		this.quaternion.copy(this._quaternion);

		this.translateX(this._lDecay.x * this._parallaxIntensity * 0.8);
		this.translateY(this._lDecay.y * this._parallaxIntensity * 0.2);
		// this.rotateY(this._lDecay.x * 0.1 * this._parallaxIntensity * 0.03);
		// this.rotateX(-this._lDecay.y * 0.01 * this._parallaxIntensity);
		this.lookAt(0, this.position.y, -5);
	}

	onMouseMove({ webgl }) {
		this._decay.set(webgl.x * 0.25, webgl.y * 0.25);
	}
}

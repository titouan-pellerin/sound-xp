import app from 'scripts/App.js';
import state from 'scripts/State.js';

export default class {
	constructor() {
		state.register(this);
		this._rendererInfos = app.webgl.renderer.info;
		this._rendererInfos.autoReset = false;
	}
	async load() {
		const Stats = (await import('stats-js')).default;
		this._stats = new Stats();
		this._stats.showPanel(0);
		document.body.appendChild(this._stats.dom);

		this._webglInfos = document.createElement('div');
		this._webglInfos.classList.add('webgl-infos');
		document.body.appendChild(this._webglInfos);
	}

	onTick() {
		this._stats.update();
		this._webglInfos.textContent = `Calls : ${this._rendererInfos.render.calls}, Triangles : ${this._rendererInfos.render.triangles}, Geometries : ${this._rendererInfos.memory.geometries}, Textures : ${this._rendererInfos.memory.textures}, Programs : ${this._rendererInfos.programs?.length}`;
		this._rendererInfos.reset();
	}
}

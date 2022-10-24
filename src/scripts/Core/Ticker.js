import state from 'scripts/State.js';
import { EVENTS } from 'utils/constants.js';

export default class {
	constructor() {
		state.register(this);

		this.current = Date.now();
		this.elapsed = 0;
		this.delta = 16;
		this._playing = false;
		this._rendering = true;

		this.params = { et: 0, dt: 0 };
	}

	onAttach() {
		this.play();
	}

	play = () => {
		this._playing = true;
		this.tick();
	};

	pause = () => {
		this._playing = false;
	};

	tick = () => {
		if (!this._playing) return;
		window.requestAnimationFrame(this.tick);

		const current = Date.now();

		this.delta = current - this.current;

		this.elapsed += this.delta;
		this.current = current;

		if (this.delta > 60) this.delta = 60;

		this.params.et = this.elapsed;
		this.params.dt = this.delta * 0.001;

		state.emit(EVENTS.TICK, this.params);
		state.emit(EVENTS.RENDER, this.params);
	};
}

import stateMixin from 'utils/stateMixin.js';

import { sRGBEncoding, WebGLRenderer } from 'three';

/**
 * @extends WebGLRenderer
 */
export default class extends stateMixin(WebGLRenderer) {
	constructor() {
		super({ antialias: false, powerPreference: 'high-performance' });
		this.outputEncoding = sRGBEncoding;
		this.autoClear = false;
	}

	onAttach() {}

	onResize({ width, height, dpr }) {
		this.setSize(width, height);
		this.setPixelRatio(dpr);
	}
}

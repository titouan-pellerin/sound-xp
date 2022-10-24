// @ts-nocheck
/**
 * Class mix-in system based on
 * https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes#les_mix-ins
 * https://github.com/luruke/bidello/blob/master/index.js
 */

import state from 'scripts/State.js';

export default (superclass = class T {}) =>
	class extends superclass {
		constructor(...args) {
			super(...args);
			state.register(this);
		}

		destroy() {
			state.unregister(this);
		}
	};

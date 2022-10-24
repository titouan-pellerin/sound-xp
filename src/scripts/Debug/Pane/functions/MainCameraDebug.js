import app from 'scripts/App.js';
import state from 'scripts/State.js';
import { EVENTS } from 'utils/constants.js';

/**
 *
 * @param {*} pane
 * @param {import('Webgl/MainCamera.js').default} instance
 */

let _far = 0;
export default function (pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	const toggleOrbit = async () => {
		const parent = app.$wrapper;
		if (!instance.orbitControls) {
			parent.style.pointerEvents = 'all';
			const OrbitThree = await import('three/examples/jsm/controls/OrbitControls');
			instance.orbitControls = new OrbitThree.OrbitControls(instance, parent);
			instance.orbitControls.enableDamping = true;
			instance.orbitControls.dampingFactor = 0.15;
			instance.orbitControls.enableZoom = true;
			instance.orbitControls.update();
			instance.position.z += 10;
			_far = instance.far;
			instance.far = 200;
			instance.updateProjectionMatrix();
		} else {
			parent.style.pointerEvents = '';
			instance.orbitControls.dispose();
			instance.orbitControls = null;
			instance.position.set(0, 0, 0);
			instance.far = _far;
			instance.updateProjectionMatrix();
		}
	};
	const orbit = { Orbit: false };

	const url = new URLSearchParams(location.search);
	if (url.has('orbit')) {
		toggleOrbit();
		orbit.Orbit = true;
	}

	folder
		.addInput(orbit, 'Orbit', {
			title: 'OrbitControls',
		})
		.on('change', toggleOrbit);

	folder.addInput(instance, 'fov');
	folder.addInput(instance, 'near');
	folder.addInput(instance, '_position');

	folder.on('change', () => instance.updateProjectionMatrix());

	state.on(EVENTS.TICK, () => instance.orbitControls?.update());

	return folder;
}

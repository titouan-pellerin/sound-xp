import { EquirectangularReflectionMapping, EquirectangularRefractionMapping, PMREMGenerator } from 'three';

// Used to provide hot reload on shader files
export function hotMaterial(vs, fs, cb, hmr) {
	const obj = {
		vs,
		fs,
		use: (instance) => {
			instance.fragmentShader = fs;
			instance.vertexShader = vs;
		},
		unuse: () => {},
	};

	if (hmr) {
		obj.instances = new Set();

		obj.use = (instance) => {
			instance.fragmentShader = fs;
			instance.vertexShader = vs;
			instance.needsUpdate = true;
			obj.instances.add(instance);
		};

		obj.unuse = (instance) => {
			obj.instances.delete(instance);
		};

		obj.update = (newObj) => {
			const o = newObj.default;
			obj.vs = o.vs;
			obj.fs = o.fs;
			o.use = obj.use;
			o.unuse = obj.unuse;
			o.instances = obj.instances;
			o.update = obj.update;
			obj.instances.forEach((instance) => {
				instance.fragmentShader = obj.fs;
				instance.vertexShader = obj.vs;
				instance.needsUpdate = true;
			});
		};

		if (cb) cb(obj.update);
	}

	return obj;
}

export function throttle(callback, delay) {
	let last;
	let timer;

	return function () {
		const context = this;
		const now = +new Date();
		const args = arguments;
		if (last && now < last + delay) {
			clearTimeout(timer);
			timer = setTimeout(function () {
				last = now;
				callback.apply(context, args);
			}, delay);
		} else {
			last = now;
			callback.apply(context, args);
		}
	};
}

export function debounce(fn, delay = 1, opts = {}) {
	const thisArg = opts.bind || null;
	const trail = opts.trail != null ? !!opts.trail : true;

	let pa1, pa2, pa3; // proxy args
	let timeout;
	let needTrail = trail;

	function delayed() {
		timeout = null;
		if (trail) needTrail = true;
		fn.call(thisArg, pa1, pa2, pa3);
	}

	return function (a1, a2, a3) {
		if (timeout) clearTimeout(timeout);

		pa1 = a1;
		pa2 = a2;
		pa3 = a3;

		if (trail && needTrail) {
			needTrail = false;
			fn.call(thisArg, pa1, pa2, pa3);
		}

		timeout = setTimeout(delayed, delay);
	};
}

export function computeEnvmap(renderer, texture, refraction = false) {
	texture.mapping = refraction ? EquirectangularRefractionMapping : EquirectangularReflectionMapping;
	const pmremGenerator = new PMREMGenerator(renderer);
	pmremGenerator.compileEquirectangularShader();

	const pmrem = pmremGenerator.fromEquirectangular(texture).texture;

	texture.dispose();
	pmremGenerator.dispose();

	return pmrem;
}

export function isElementVisible(el) {
	return !!el.offsetParent;
}

export function disposeMesh(mesh) {
	mesh.traverse((child) => {
		if (child.material) {
			child.material.map?.dispose();
			child.material.normalMap?.dispose();
			child.material.alphaMap?.dispose();
			child.material.aoMap?.dispose();
			child.material.specularMap?.dispose();
			child.material.metalnessMap?.dispose();
			child.material.emissiveMap?.dispose();
			child.material.dispose();

			if (child.material.uniforms) {
				Object.values(child.material.uniforms).forEach((u) => {
					if (u.value?.isTexture) u.value.dispose();
				});
			}

			if (child.userData?.uniforms) {
				Object.values(child.userData.uniforms).forEach((u) => {
					if (u.value?.isTexture) u.value.dispose();
				});
			}
		}
		child.geometry?.dispose();
	});
}

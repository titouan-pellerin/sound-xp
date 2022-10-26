let c = 0;

export default function hotMaterial(shader, type, cb) {
	const noop = () => {};

	const obj = {
		c: ++c,
		shader,
		use: (el) => {
			const instance = el.material || el;
			instance[type] = shader;
			instance.needsUpdate = true;
			return el;
		},
		unuse: noop,
		clear: noop,
	};

	if (import.meta.hot) {
		obj.instances = new Set();

		obj.use = (el) => {
			const instance = el.material || el;
			instance[type] = obj.shader;
			instance.needsUpdate = true;
			obj.instances.add(instance);
			return el;
		};

		obj.unuse = (instance) => {
			obj.instances.delete(instance);
		};

		obj.clear = (_instance) => {
			obj.instances.clear();
		};

		obj.update = (newObj) => {
			const o = newObj.default;
			o.orig = obj.orig || obj;
			o.orig.shader = o.shader;
			Object.assign(o, o.orig);
			obj.instances.forEach(o.use);
		};

		if (cb) cb(obj.update);
	}

	return obj;
}

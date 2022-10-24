import state from 'scripts/State.js';
import { Cache, LinearEncoding, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EVENTS } from 'utils/constants.js';
import { manifest } from 'utils/manifest.js';

Cache.enabled = true;

export default class {
	constructor() {
		this._assetsToLoad = [];
		this._assetsSizeKnown = 0;
		this.progress = 0;
		this._sorted = false;

		this._textureLoader = new TextureLoader().setPath('/assets');
		this._gltfLoader = new GLTFLoader().setPath('/assets');
		this._rgbeLoader = new RGBELoader().setPath('/assets');

		/** @type {Map<string, import('three').Texture>}*/
		this.loadedTextures = new Map();
		/** @type {Map<string, import('three').Object3D>} */
		this.loadedModels = new Map();
		/** @type {Map<string, Object>} */
		this.loadedJSONs = new Map();
		/** @type {Map<string, string>} */
		this.loadedRaws = new Map();
	}

	add(...assets) {
		for (const asset of assets) {
			// the assets must be added to /src/script/utils/manifest.js to be Loaded
			const existingAsset = this._assetsToLoad.find((a) => a.key === asset.key);
			if (existingAsset) {
				existingAsset.callbacks.push(asset.callback);
				continue;
			}
			if (!manifest[asset.key]) {
				/// #if DEBUG
				console.warn(`Manifest key ${asset.key} not found`);
				/// #endif
				continue;
			}

			this._assetsToLoad.push({ key: asset.key, callbacks: [asset.callback], priority: manifest[asset.key].priority, path: manifest[asset.key].path, size: null, progress: 0 });
		}
	}

	getTexture(key) {
		if (this.loadedTextures.has(key)) return this.loadedTextures.get(key);
		/// #if DEBUG
		else console.error(`Loaded texture ${key} not found`);
		/// #endif
	}

	getModel(key) {
		if (this.loadedModels.has(key)) return this.loadedModels.get(key);
		/// #if DEBUG
		else console.error(`Loaded model ${key} not found`);
		/// #endif
	}

	getJSON(key) {
		if (this.loadedJSONs.has(key)) return this.loadedJSONs.get(key);
		/// #if DEBUG
		else console.error(`Loaded JSON ${key} not found`);
		/// #endif
	}

	getRaw(key) {
		if (this.loadedRaws.has(key)) return this.loadedRaws.get(key);
		/// #if DEBUG
		else console.error(`Loaded raw ${key} not found`);
		/// #endif
	}

	loadAssets(criticals = false) {
		let assets = this._assetsToLoad;

		if (!this._sorted) {
			this._assetsToLoad.sort((a, b) => a.priority - b.priority);
			this._sorted = true;
		}

		if (criticals) {
			const criticals = this._assetsToLoad.filter((asset) => asset.priority === 1);
			this._assetsToLoad.splice(0, criticals.length);
			assets = criticals;
		}

		return Promise.all(assets.map((asset) => this.loadAsset(asset.key, asset.path).then((result) => asset?.callbacks.forEach((callback) => callback(result)))));
	}

	loadAsset(key, path) {
		let assetPromise;
		switch (path.split('.').pop().toLowerCase()) {
			case 'jpg':
			case 'jpeg':
			case 'png':
				assetPromise = this.loadTexture(key, path);
				break;
			case 'hdr':
				assetPromise = this.loadEnvMap(key, path);
				break;
			case 'gltf':
			case 'glb':
				assetPromise = this.loadModel(key, path);
				break;
			case 'fnt':
			case 'json':
				assetPromise = this.loadJSON(key, path);
				break;
			default:
				assetPromise = this.loadRaw(key, path);
				break;
		}
		return assetPromise;
	}

	/**
	 *
	 * @param {string} key
	 * @returns {Promise<import('three').Texture | null>}
	 */
	async loadTexture(key, path) {
		let loadedTexture = this.loadedTextures.get(key);
		if (!loadedTexture) {
			loadedTexture = await this._textureLoader.loadAsync(path, (e) => this.assetProgress(e, key));
			this.loadedTextures.set(key, loadedTexture);
		}
		return loadedTexture;
	}

	/**
	 *
	 * @param {string} key
	 * @returns {Promise<import('three').Texture | null>}
	 */
	async loadEnvMap(key, path) {
		let loadedTexture = this.loadedTextures.get(key);
		if (!loadedTexture) {
			loadedTexture = await this._rgbeLoader.loadAsync(path, (e) => this.assetProgress(e, key));
			this.loadedTextures.set(key, loadedTexture);
		}

		return loadedTexture;
	}

	/**
	 *
	 * @param {string} key
	 * @returns {Promise<import('three').Object3D | null>}
	 */
	async loadModel(key, path) {
		let loadedModel = this.loadedModels.get(key);
		if (!loadedModel) {
			const gltf = await this._gltfLoader.loadAsync(path, (e) => this.assetProgress(e, key));
			gltf.scene.traverse((object) => {
				if (object.isMesh && object.material?.map) {
					object.material.map.encoding = LinearEncoding;
					object.material.envMapIntensity = 0.5;
				}
			});
			const animations = gltf.animations;
			loadedModel = gltf.scene;
			loadedModel.animations = animations;
			this.loadedModels.set(key, loadedModel);
		}
		return loadedModel;
	}

	async loadRaw(key, path) {
		let loadedRaw = this.loadedRaws.get(key);

		if (!loadedRaw) {
			const response = await fetch(path);
			const loadedRaw = await response.text();
			this.loadedRaws.set(key, loadedRaw);
		}

		return loadedRaw;
	}

	async loadJSON(key, path) {
		let loadedJSON = this.loadedJSONs.get(key);
		if (!loadedJSON) {
			const response = await fetch(path);
			const loadedJSON = await response.json();
			this.loadedJSONs.set(key, loadedJSON);
		}
		return loadedJSON;
	}

	assetProgress(e, key) {
		const asset = this._assetsToLoad.find((a) => a.key === key);
		if (!asset) return;

		if (!asset.size) {
			asset.size = e.total;
			this._assetsSizeKnown++;
		}
		asset.progress = e.loaded / asset.size;

		this.progress = this._assetsToLoad.map((asset) => asset.progress).reduce((previousValue, currentValue) => previousValue + currentValue, 0) / this._assetsSizeKnown;
		state.emit(EVENTS.LOADER_PROGRESS, this.progress);
	}
}

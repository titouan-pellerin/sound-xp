import createCoreModules from 'Core/index.js';
import createToolsModules from 'Tools/index.js';
import { DEBUG } from 'utils/config.js';
import { EVENTS } from 'utils/constants.js';
import createWebglModules from 'Webgl/index.js';
import createDebugModules from './Debug/index.js';
import createDomModules from './Dom/index.js';
import createSharedModules from './Shared/index.js';
import state from './State.js';

class App {
	/** @type App */
	static instance;
	constructor() {}

	async init() {
		this.$app = document.getElementById('app');
		this.$wrapper = document.getElementById('canvas-wrapper');

		this.core = createCoreModules();
		this.tools = createToolsModules();
		this.webgl = createWebglModules();
		this.shared = createSharedModules();
		this.dom = createDomModules();
		if (DEBUG) this.debug = await createDebugModules();

		this.beforeLoad();
		await this.load();
	}

	beforeLoad() {}

	async load() {
		await this.core.loader.loadAssets();
		state.emit(EVENTS.ATTACH);
		state.emit(EVENTS.RESIZE, this.tools.viewport.infos);
	}

	static getInstance() {
		if (!App.instance) App.instance = new App();
		return App.instance;
	}
}
const app = App.getInstance();
export default app;

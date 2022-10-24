const TABS = ['WEBGL', 'DOM', 'GLOBAL'];

/** @type Record<any, any> */
const mapping = Object.fromEntries(
	Object.entries(import.meta.glob('./Pane/functions/**.js', { import: 'default', eager: true })).map(([key, value]) => {
		return [key.split('/').pop().split('.')[0].replace('Debug', ''), value];
	}),
);

export default class Pane {
	constructor() {
		/** @type Map<any, import("tweakpane").FolderApi> */
		this._childrenToAdd = new Map();
		this._folders = new Map();
	}
	async load() {
		const Tweakpane = await import('tweakpane');
		/** @type import('tweakpane').BladeApi */
		this.globalPane = new Tweakpane.Pane();

		document.addEventListener('keydown', (e) => {
			if (e.key == 'h') this.globalPane.hidden = !this.globalPane.hidden;
		});

		this._initTabs();
		this.globalPane.addButton({ title: 'Refresh' }).on('click', () => this.globalPane.refresh());
	}

	_initTabs() {
		this.tabs = this.globalPane.addTab({
			pages: TABS.map((tab) => {
				return { title: tab };
			}),
		}).pages;
	}

	addToParent(instance, name, parentName) {
		if (!this._childrenToAdd.get(parentName)) this._childrenToAdd.set(parentName, []);
		this._childrenToAdd.get(parentName).push(instance);

		if (this._folders.get(parentName)) mapping[name](this._folders.get(parentName), instance, name);
	}

	add(instance, name, tabIndex = 2) {
		if (mapping[name]) {
			const folder = mapping[name](this.tabs[tabIndex], instance, name);
			this._folders.set(name, folder);

			if (this._childrenToAdd.get(name)) {
				this._childrenToAdd.get(name).forEach((instance) => mapping[name](folder, instance, name));
				this._childrenToAdd.delete(name);
			}
		} else console.warn('No debug mapping found for', name);
	}
}

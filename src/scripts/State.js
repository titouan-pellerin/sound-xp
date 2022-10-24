// @ts-nocheck
// Inspired from https://github.com/luruke/bidello/blob/master/index.js

import { EVENTS_MAP } from 'utils/constants.js';

class State {
	/** @type State */
	static instance;
	constructor() {
		this._listeners = new Map();
		this._onceListeners = new Map();
		this._cache = new Map();
		this._instances = new Set();
	}

	once(id, fn) {
		if (!this._onceListeners.has(id)) {
			this._onceListeners.set(id, []);
		}
		this._onceListeners.get(id).push(fn);
	}

	on(id, fn) {
		if (!this._listeners.has(id)) {
			this._listeners.set(id, []);
		}
		this._listeners.get(id).push(fn);
	}

	off(id, fn) {
		if (!this._listeners.has(id)) return;

		const listeners = this._listeners.get(id);
		const index = listeners.indexOf(fn);
		if (index > -1) listeners.splice(index, 1);
	}

	register(instance) {
		this._instances.add(instance);
	}

	unregister(instance) {
		this._instances.delete(instance);
	}

	emit(id, ...args) {
		this._cache.set(id, args);
		if (this._listeners.has(id)) for (const fn of this._listeners.get(id)) fn.call(this, ...args);

		// Neeeded to emit the event on all the instances
		this._instances.forEach((instance) => this._fireMethod(instance, id));

		if (this._onceListeners.has(id)) {
			for (const fn of this._onceListeners.get(id)) fn.call(this, ...args);
			this._onceListeners.delete(id);
		}
	}

	_fireMethod(instance, id) {
		const method = instance[EVENTS_MAP[id]];
		if (typeof method === 'function' && this._cache.has(id)) method.call(instance, ...this._cache.get(id));
	}

	static getInstance() {
		if (!State.instance) State.instance = new State();
		return State.instance;
	}
}

const state = State.getInstance();
export default state;

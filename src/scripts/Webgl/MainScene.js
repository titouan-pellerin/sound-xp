import { Scene } from 'three';
import { CUBES } from 'utils/config.js';
import stateMixin from 'utils/stateMixin.js';
import InstancedObject from './Objects/InstancedObject.js';

/** @extends Scene */
export default class extends stateMixin(Scene) {
	constructor() {
		super();
		this.add(new InstancedObject({ countSqrt: CUBES.countSqrt }));
		// const points = new
	}
}

import { BoxGeometry, Color, Mesh, MeshMatcapMaterial, Scene } from 'three';
import { COLORS } from 'utils/constants.js';
import stateMixin from 'utils/stateMixin.js';

/** @extends Scene */
export default class extends stateMixin(Scene) {
	constructor() {
		super();

		this.add(new Mesh(new BoxGeometry(1, 1, 1), new MeshMatcapMaterial({ color: new Color(COLORS.WARM_RED) })));
	}
}

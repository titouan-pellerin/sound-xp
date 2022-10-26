import app from 'scripts/App.js';
import { BufferAttribute, Color, InstancedBufferGeometry, InstancedMesh, InterleavedBuffer, InterleavedBufferAttribute, Object3D } from 'three';
import globalUniforms from 'utils/globalUniforms.js';
import stateMixin from 'utils/stateMixin.js';
import InstancedCubeMaterial from 'Webgl/Material/InstancedCube/material.js';

const _dummy = new Object3D();
const _color = new Color();

/** @extends InstancedMesh */
export default class extends stateMixin(InstancedMesh) {
	constructor({ countSqrt }) {
		const geometry = new InstancedBufferGeometry();
		const vertexBuffer = new InterleavedBuffer(
			new Float32Array([
				// Front
				// eslint-disable-next-line prettier/prettier
				-1, 1, 1, 0, 0,
				1, 1, 1, 1, 0,
				-1, -1, 1, 0, 1,
				1, -1, 1, 1, 1,
				// Back
				// eslint-disable-next-line prettier/prettier
				1, 1, -1, 1, 0,
				-1, 1, -1, 0, 0,
				1, -1, -1, 1, 1,
				-1, -1, -1, 0, 1,
				// Left
				// eslint-disable-next-line prettier/prettier
				-1, 1, -1, 1, 1,
				-1, 1, 1, 1, 0,
				-1, -1, -1, 0, 1,
				-1, -1, 1, 0, 0,
				// Right
				// eslint-disable-next-line prettier/prettier
				1, 1, 1, 1, 0,
				1, 1, -1, 1, 1,
				1, -1, 1, 0, 0,
				1, -1, -1, 0, 1,
				// Top
				// eslint-disable-next-line prettier/prettier
				-1, 1, 1, 0, 0,
				1, 1, 1, 1, 0,
				-1, 1, -1, 0, 1,
				1, 1, -1, 1, 1,
				// Bottom
				// eslint-disable-next-line prettier/prettier
				1, -1, 1, 1, 0,
				-1, -1, 1, 0, 0,
				1, -1, -1, 1, 1,
				-1, -1, -1, 0, 1,
			]),
			5,
		);

		const positions = new InterleavedBufferAttribute(vertexBuffer, 3, 0);
		const uvs = new InterleavedBufferAttribute(vertexBuffer, 2, 3);

		geometry.setAttribute('position', positions);
		geometry.setAttribute('uv', uvs);

		const indices = new Uint8Array([0, 2, 1, 2, 3, 1, 4, 6, 5, 6, 7, 5, 8, 10, 9, 10, 11, 9, 12, 14, 13, 14, 15, 13, 16, 17, 18, 18, 17, 19, 20, 21, 22, 22, 21, 23]);
		geometry.setIndex(new BufferAttribute(indices, 1));
		geometry.scale(0.1, 0.1, 0.1);

		super(
			geometry,
			new InstancedCubeMaterial({
				uniforms: {
					...globalUniforms,
					uVelocityTexture: { value: null },
				},
			}),
			countSqrt * countSqrt,
		);
		this._countSqrt = countSqrt;
		this._initInstances();
	}

	_initInstances() {
		for (let i = 0; i < this.count; i++) {
			// _dummy.position.random().subScalar(0.5).multiplyScalar(1);
			// _dummy.rotation.x = Math.random() * Math.PI;
			// _dummy.rotation.y = Math.random() * Math.PI;
			// _dummy.rotation.z = Math.random() * Math.PI;
			// _dummy.updateMatrix();
			// this.setMatrixAt(i, _dummy.matrix);

			const x = (i % this._countSqrt) / this._countSqrt;
			const y = ~~(i / this._countSqrt) / this._countSqrt;

			this.setColorAt(i, _color.setRGB(x, y, Math.random() + 0.1));
		}
	}

	onAttach() {}

	onTick() {
		this.material.uniforms.uVelocityTexture.value = app.webgl.fbo.getCurrentTexture();
	}
}

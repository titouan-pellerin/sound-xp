precision highp float;

uniform float uTime;
uniform sampler2D uVelocityTexture;

varying vec2 vUv;
varying vec2 vReference;

void main() {
	gl_FragColor = vec4(vReference, 1., 1.);
	gl_FragColor = vec4(texture2D(uVelocityTexture, vUv).rgb, 1.);
	gl_FragColor = vec4(vUv, 1., 1.);
}

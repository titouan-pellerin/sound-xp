uniform sampler2D tDiffuse1;
uniform sampler2D tDepth1;
uniform sampler2D tDiffuse2;
uniform sampler2D tDepth2;

uniform sampler2D uGrain;

uniform float uRatio;

uniform float uTime;

#ifdef USE_FXAA
uniform vec2 uResolution;

varying vec2 vRgbNW;
varying vec2 vRgbNE;
varying vec2 vRgbSW;
varying vec2 vRgbSE;
varying vec2 vRgbM;
#endif

varying vec2 vUv;

#define PI 3.14159265359
#define NEAR 1.
#define FAR 100.


float viewZToOrthographicDepth(const in float viewZ, const in float near, const in float far) {
	return (viewZ + near) / (near - far);
}
float perspectiveDepthToViewZ(const in float invClipZ, const in float near, const in float far) {
	return (near * far) / ((far - near) * invClipZ - far);
}

float readDepth(sampler2D depthSampler, vec2 coord) {
	float fragCoordZ = texture2D(depthSampler, coord).x;
	float viewZ = perspectiveDepthToViewZ(fragCoordZ, NEAR, FAR);
	return viewZToOrthographicDepth(viewZ, NEAR, FAR);
}

#ifdef USE_FXAA
	#include ./chunks/fxaa/fxaa.glsl;
#endif


void main() {
	// FXAAA
	#ifdef USE_FXAA
		vec3 scene1 = fxaa(tDiffuse1, gl_FragCoord.xy, uResolution, vRgbNW, vRgbNE, vRgbSW, vRgbSE, vRgbM).rgb;
	#else
		vec3 scene1 = texture2D(tDiffuse1, vUv).rgb;
	#endif

	gl_FragColor = vec4(scene1, 1.);

}

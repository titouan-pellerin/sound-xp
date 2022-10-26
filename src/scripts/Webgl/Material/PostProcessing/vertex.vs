varying vec2 vUv;

#ifdef USE_FXAA
uniform vec2 uResolution;

varying vec2 vRgbNW;
varying vec2 vRgbNE;
varying vec2 vRgbSW;
varying vec2 vRgbSE;
varying vec2 vRgbM;

#include ./chunks/fxaa/texcoords.glsl;
#endif

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.);
  #ifdef USE_FXAA
  texcoords(vUv * uResolution, uResolution, vRgbNW, vRgbNE, vRgbSW, vRgbSE, vRgbM);
  #endif
}

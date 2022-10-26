attribute vec3 position;
attribute vec2 uv;
// attribute mat4 instanceMatrix;
attribute vec3 instanceColor;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D uVelocityTexture;

uniform float uTime;

varying vec2 vUv;
varying vec2 vReference;

void main() {
  vUv = uv;
  vReference = instanceColor.xy;

  vec3 pos = position;

  vec4 velocity = texture2D(uVelocityTexture, vReference.xy);

  float scale = clamp(0., 5., velocity.a);

  mat4 newPosMat = mat4(
    instanceColor.b, 0.0, 0.0, 0.0,
    0.0, instanceColor.b, 0.0, 0.0,
    0.0, 0.0, instanceColor.b, 0.0,
    velocity.xyz, 1.
  );

  vec4 mvPosition = modelViewMatrix * newPosMat * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}

uniform float uTime;
uniform float uDelta;

uniform float uMusicVolume;
uniform sampler2D uPosition;

void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // Texture sampling
    vec4 tmpPos = texture2D(uPosition, uv);
    vec4 velocity = texture2D(uVelocity, uv);
    
    vec3 position = tmpPos.xyz;
    // position.y *= (uMusicVolume) + .1;

    float life = velocity.a;

    if(life < .0) {
        position = tmpPos.xyz;
        life = 1.;
        // life = .5 + fract(tmpPos.a + uTime);
    } else {
        // position *= sin(uTime * .01) * 10.;
        // velocity *= uMusicVolume;
        position = position + velocity.xyz;
        position.y += cos(velocity.y * uMusicVolume) * .1;
        life -= uDelta;
    }

    gl_FragColor = vec4(position, life);

}
void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tmpPos = texture2D( texturePosition, uv );
    // vec3 position = tmpPos.xyz;
    
    gl_FragColor = vec4(tmpPos);

}
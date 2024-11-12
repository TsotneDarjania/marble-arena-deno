#ifdef GL_ES
precision mediump float;
#endif

uniform float time;          // Uniform to control time-based animation
uniform vec2 resolution;     // Screen resolution

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy; // Normalize coordinates

    // Apply a subtle wave effect using sine functions
    float wave = sin(uv.y * 10.0 + time * 2.0) * 0.005;
    uv.x += wave; // Apply the wave effect to the x-axis

    // Sample the texture with distorted UV coordinates
    vec4 color = texture2D(uMainSampler, uv);

    gl_FragColor = color;
}

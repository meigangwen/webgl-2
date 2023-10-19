#version 300 es
in vec2 a_position;         //screen position in pixels

uniform vec2 u_resolution;  //vec2 screen resolution in pixels

void main() {
//bascially convert screen space to clip sapce

    vec2 zeroToOne = a_position / u_resolution;

    vec2 zeroToTwo = zeroToOne * 2.0;

    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
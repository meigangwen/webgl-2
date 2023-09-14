#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution; // for shadertoy, this is iResolution
uniform vec2 u_mouse;      // for shadertoy, this is iMouse
uniform float u_time;      // for shadertoy, this is iTime

void main() {
	vec2 st = gl_FragCoord.xy/iResolution.xy;
    //vec2 pointer = gl_FragCoord.xy/iMouse.xy;
	gl_FragColor = vec4(st.x,st.y,abs(sin(iTime*0.5)),1.0);
}
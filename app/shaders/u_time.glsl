#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time; // for shader toy, this global variable is called iTime

void main() {
	gl_FragColor = vec4(abs(sin(iTime*0.5)),0.0,0.0,1.0);
}
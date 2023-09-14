#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

vec4 red(){
    return vec4(1.0,0.0,0.0,1.0);
}

vec4 blue(){
    return vec4(0.0,0.0,1.0,1.0);
}

vec4 yellow(){
	return vec4(vec3(1.0,1.0,0.0),1.0);
}

void main() {
	gl_FragColor = yellow();
}
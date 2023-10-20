#version 300 es

precision highp float;
in vec3 v_normal;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

out vec4 outColor;

void main() {
    //because v_normal is a varying, it will not be a unit vector
    vec3 normal = normalize(v_normal);

    //compute the light by taking the dot product
    //float light = dot(normal, u_reverseLightDirection);
    float light = dot(normal, u_reverseLightDirection);

    outColor = u_color;
    outColor.rgb = outColor.rgb * light;
}
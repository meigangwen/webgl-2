#version 300 es

precision highp float;
in vec3 v_normal;
in vec3 v_surfaceToLight;

//uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

//we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
    //because v_normal is a varying, it will not be a unit vector
    vec3 normal = normalize(v_normal);

    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);

    //compute the light by taking the dot product
    //float light = dot(normal, u_reverseLightDirection);
    float light = dot(normal, surfaceToLightDirection);

    outColor = u_color;
    outColor.rgb = outColor.rgb * light;
}
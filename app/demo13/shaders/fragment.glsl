#version 300 es

precision highp float;
in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

//uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;
uniform float u_shininess;
uniform vec3 u_lightDirection;

uniform float u_innerLimit;      // in dot space
uniform float u_outerLimit;      // in dot space

//we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
    //because v_normal is a varying, it will not be a unit vector
    vec3 normal = normalize(v_normal);

    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    //compute the light by taking the dot product
    float light = 0.0;
    float specular = 0.0;

    float dotFromDirection = dot(surfaceToLightDirection, -u_lightDirection);
    float inLight = smoothstep(u_outerLimit, u_innerLimit, dotFromDirection);
    
    light = inLight * dot(normal, surfaceToLightDirection);
    specular = inLight * pow(dot(normal, halfVector), u_shininess);

    outColor = u_color;

    //just multiply the color portion by the light
    outColor.rgb *= light;

    //just add in the specular
    outColor.rgb += specular;
}
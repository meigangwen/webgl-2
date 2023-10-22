#version 300 es

precision highp float;
in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

//uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;
uniform float u_shininess;


uniform vec3 u_lightColor;
uniform vec3 u_specularColor;

//we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
    //because v_normal is a varying, it will not be a unit vector
    vec3 normal = normalize(v_normal);

    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    //compute the light by taking the dot product
    //float light = dot(normal, u_reverseLightDirection);
    float light = dot(normal, surfaceToLightDirection);
    float specular = 0.0;
    if (light > 0.0) {
        specular = pow(dot(normal, halfVector), u_shininess);
    }
    
    outColor = u_color;

    //just multiply the color portion by the light
    outColor.rgb *= light * u_lightColor;

    //just add in the specular
    outColor.rgb += specular * u_specularColor;
}
#version 300 es
in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_worldViewProjection;
//uniform mat4 u_world; not using the world matrix directly due to scaling
uniform mat4 u_worldInverseTranspose;

//uniform mat4 u_matrix;
//out vec4 v_color;
out vec3 v_normal;

void main() {
    // Multiply the position by the matrix
    gl_Position = u_worldViewProjection * a_position;

    // Orient the normals and pass to the fragment shader
    // Normals are a direction so we don't care about translation
    // The orientation portion of the u_world matrix is only in the top 3x3 area
    v_normal = mat3(u_worldInverseTranspose) * a_normal;
}
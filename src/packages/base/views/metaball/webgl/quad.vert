#version 300 es
in vec4 a_position;
in vec4 a_offset;
in vec2 a_uv;


uniform float u_time;
uniform mat4 u_projectionMatrix;

out vec2 v_uv;


void main() {
  gl_Position = u_projectionMatrix * (a_position + a_offset + vec4(sin(a_offset.y + u_time) * 20.0, cos(a_offset.x + u_time) * 20.0, 0.0, 0.0));
  v_uv = a_uv;
}

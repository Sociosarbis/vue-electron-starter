#version 300 es
precision highp float;


in vec2 v_uv;


out vec4 outColor;


void main() {
  float dist = distance(v_uv, vec2(0.5)) * 2.0;

  float c = clamp(1.0 - dist, 0.0, 1.0);

  outColor = vec4(vec3(1.0), c);
}

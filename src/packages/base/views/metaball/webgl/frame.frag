#version 300 es
precision highp float;

uniform sampler2D u_texture;

in vec2 v_uv;

out vec4 outputColor;

void main () {
  vec4 inputColor = texture(u_texture, v_uv);

  float cutoffThreshold = 0.5;

  float cutoff = step(cutoffThreshold, inputColor.a);


  vec4 emptyColor = vec4(0.0);
  vec4 borderColor = vec4(1.0, 0.0, 0.0, 1.0);
  outputColor = mix(
    emptyColor,
    borderColor,
    cutoff
  );

  cutoffThreshold += 0.05;
  cutoff = step(cutoffThreshold, inputColor.a);
  vec4 fillColor = vec4(1.0, 1.0, 0.0, 1.0);

  outputColor = mix(
    outputColor,
    fillColor,
    cutoff
  );
}

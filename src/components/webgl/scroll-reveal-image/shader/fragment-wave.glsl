#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform vec2      uTextureSize;
uniform vec2      uElementSize;
uniform float     uProgress;
uniform vec3      uFillColor;

in  vec2 vUv;
out vec4 fragColor;

float quadraticInOut(float t) {
  float p = 2.0 * t * t;
  return t < 0.5 ? p : -p + 4.0 * t - 1.0;
}

void main() {
  vec2 uv = vUv - 0.5;
  float aspect1 = uTextureSize.x / uTextureSize.y;
  float aspect2 = uElementSize.x  / uElementSize.y;
  if (aspect1 > aspect2) { uv *= vec2(aspect2 / aspect1, 1.0); }
  else                   { uv *= vec2(1.0, aspect1 / aspect2); }
  uv += 0.5;

  float imageAspect = uTextureSize.x / uTextureSize.y;
  float progress    = quadraticInOut(1.0 - uProgress);
  float s           = 50.0;
  vec2  gridSize    = vec2(s, floor(s / imageAspect));

  float v = smoothstep(
    0.0, 1.0,
    vUv.y
    + sin(vUv.x * 4.0 + progress * 6.0)
      * mix(0.3, 0.1, abs(0.5 - vUv.x))
      * 0.5
      * smoothstep(0.0, 0.2, progress)
    + (1.0 - progress * 2.0)
  );

  float mixnewUV = (vUv.x * 3.0 + (1.0 - v) * 50.0) * progress;
  vec2  subUv    = mix(uv, floor(uv * gridSize) / gridSize, mixnewUV);

  vec4 color = texture(uTexture, subUv);
  color.a    = pow(v, 1.0);
  color.rgb  = mix(color.rgb, uFillColor,
                   smoothstep(0.5, 0.0, abs(0.5 - color.a)) * progress);

  fragColor      = color;
  fragColor.rgb  = pow(max(fragColor.rgb, vec3(0.0)), vec3(1.0 / 2.2));
}

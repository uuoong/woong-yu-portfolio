export const fragmentPixel = `
#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform vec2      uTextureSize;
uniform vec2      uElementSize;
uniform float     uProgress;
uniform vec3      uFillColor;

in  vec2 vUv;
out vec4 fragColor;

vec3 blendNormal(vec3 base, vec3 blend) { return blend; }
vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
  return blendNormal(base, blend) * opacity + base * (1.0 - opacity);
}

float PristineGrid(vec2 uv, vec2 lineWidth) {
  vec4 uvDDXY = vec4(dFdx(uv), dFdy(uv));
  vec2 uvDeriv = vec2(length(uvDDXY.xz), length(uvDDXY.yw));
  bool invertLine = lineWidth.x > 0.5;
  vec2 targetWidth = invertLine ? vec2(1.0) - lineWidth : lineWidth;
  vec2 drawWidth = clamp(targetWidth, uvDeriv, vec2(0.5));
  vec2 lineAA = max(uvDeriv, 0.000001) * 5.5;
  vec2 gridUV = abs(fract(uv) * 2.0 - 1.0);
  gridUV = invertLine ? gridUV : 1.0 - gridUV;
  vec2 grid2 = smoothstep(drawWidth + lineAA, drawWidth - lineAA, gridUV);
  grid2 *= clamp(targetWidth / drawWidth, 0.0, 1.0);
  grid2 = mix(grid2, targetWidth, clamp(uvDeriv * 2.0 - vec2(1.0), vec2(0.0), vec2(1.0)));
  grid2 = invertLine ? 1.0 - grid2 : grid2;
  return mix(grid2.x, 1.0, grid2.y);
}

float cubicOut(float t)    { float f = t - 1.0; return f * f * f + 1.0; }
float quadraticOut(float t){ return -t * (t - 2.0); }
float cubicInOut(float t)  {
  return t < 0.5 ? 4.0 * t * t * t : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}
float map(float v, float a, float b, float c, float d) {
  return clamp(c + (v - a) * (d - c) / (b - a), c, d);
}

void main() {
  vec2 uv = vUv - 0.5;
  float aspect1 = uTextureSize.x / uTextureSize.y;
  float aspect2 = uElementSize.x  / uElementSize.y;
  if (aspect1 > aspect2) { uv *= vec2(aspect2 / aspect1, 1.0); }
  else                   { uv *= vec2(1.0, aspect1 / aspect2); }
  uv += 0.5;

  float uAspect = uElementSize.x / uElementSize.y;
  vec4 defaultColor = texture(uTexture, uv);

  float pixelateProgress = map(uProgress, 0.3, 1.0, 0.0, 1.0);
  pixelateProgress = floor(pixelateProgress * 12.0) / 12.0;
  float s = floor(mix(11.0, 50.0, quadraticOut(pixelateProgress)));
  vec2 gridSize = vec2(s, floor(s / uAspect));

  vec2 newUV = floor(vUv * gridSize) / gridSize + 0.5 / vec2(gridSize);
  vec4 color = texture(uTexture, newUV);
  float finalProgress = map(uProgress, 0.75, 1.0, 0.0, 1.0);
  color = mix(color, defaultColor, finalProgress);

  float lines = PristineGrid(vUv * gridSize, vec2(0.2 * (1.0 - uProgress)));

  float discardProgress = map(uProgress, 0.0, 0.8, 0.0, 1.0);
  if (vUv.x > cubicOut(discardProgress)) discard;

  float gradWidth  = mix(0.4, 0.2, uProgress);
  float customProg = map(cubicInOut(uProgress), 0.0, 1.0, -gradWidth, 1.0 - gradWidth);
  float fillGradient = smoothstep(customProg, customProg + gradWidth, vUv.x);

  fragColor.a   = 1.0;
  fragColor.rgb = blendNormal(vec3(1.0 - lines), color.rgb, 0.9);
  fragColor.rgb = mix(fragColor.rgb, uFillColor, fillGradient);
  fragColor.rgb = mix(fragColor.rgb, defaultColor.rgb, finalProgress);
  fragColor.rgb = pow(max(fragColor.rgb, vec3(0.0)), vec3(1.0 / 2.2));
}
`

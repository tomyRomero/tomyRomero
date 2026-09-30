import { NOISE_GLSL } from './gl';

// Bubbles wallpaper background. 1440×900 design space, y up, x from the center.
export const BUBBLES_FS = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uTop, uMid, uDeep, uRay, uSand, uGrass, uSnow;
uniform float uDark;
${NOISE_GLSL}

float px;

// Distance between the nearest two drifting cell centers: small along the
// seams, which is where light bunches up into caustics
float cells(vec2 x, float t) {
  vec2 n = floor(x), f = fract(x);
  float f1 = 8., f2 = 8.;
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 o = .5 + .42 * sin(t + 6.2831 * h22(n + g));
    float d = length(g + o - f);
    if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d;
  }
  return f2 - f1;
}
// Two layers of thin, wobbly seams; the domain warp bends the straight cell
// edges into the curved webs real caustics make
float caustic(vec2 x, float t) {
  x += .4 * vec2(n2(x * .7 + t * .15), n2(x * .7 + 4.7 - t * .12));
  float a = 1. - smoothstep(0., .11, cells(x, t));
  float b = 1. - smoothstep(0., .11, cells(x * 1.27 + 3.1, t * 1.15 + 1.7));
  return max(a, b * .75) * (.55 + .45 * n2(x * .5 + t * .2));
}

float floorY(float x) { return 64. + 26. * (fbm1(x * .0034 + 2.) - .5) * 2. + 4. * n1(x * .03); }

// Seagrass: x, height, width, phase
const vec4 GRASS[14] = vec4[14](
  vec4(-700., 250., 7., 0.), vec4(-676., 330., 8., 1.3), vec4(-652., 210., 6., 2.1), vec4(-628., 290., 7., 3.4),
  vec4(-604., 180., 6., 4.2), vec4(-580., 240., 6., 5.),
  vec4(560., 200., 6., .7), vec4(586., 300., 8., 1.9), vec4(612., 240., 7., 2.8), vec4(640., 350., 8., 3.6),
  vec4(668., 220., 6., 4.4), vec4(696., 280., 7., 5.3),
  vec4(-40., 120., 5., 2.4), vec4(-18., 160., 6., 3.9)
);
const vec2 STREAMS[4] = vec2[4](vec2(-470., 1.), vec2(-150., 1.6), vec2(310., 1.25), vec2(520., .8));

void main() {
  float s = uRes.y / 900.;
  px = 1. / s;
  vec2 p = vec2(gl_FragCoord.x - uRes.x * .5, gl_FragCoord.y) / s;
  float y = p.y / 900.;
  float t = uTime;

  // Water: bright under the surface, deep toward the floor
  vec3 col = mix(uDeep, uMid, smoothstep(0., .62, y));
  col = mix(col, uTop, smoothstep(.58, 1., y));
  vec2 src = vec2(-240., 1260.);
  col += uRay * exp(-length(p - vec2(-240., 960.)) / 520.) * (.22 - .1 * uDark);

  // Light shafts fanning down from above the surface, slowly swaying
  vec2 d = p - src;
  float ang = atan(d.x, -d.y);
  float rays = smoothstep(.5, .92, fbm1(ang * 13. + t * .05)) * .75
             + smoothstep(.55, .95, fbm1(ang * 23. - t * .038 + 7.)) * .45;
  rays *= smoothstep(-150., 900., p.y) * (.25 + .75 * y);
  col += uRay * rays * (.2 - .08 * uDark);

  // The underside of the surface, rippling
  float band = smoothstep(790., 900., p.y);
  if (band > 0.) {
    float sc = caustic(vec2(p.x * .009, p.y * .022) + vec2(t * .05, 0.), t * .7);
    col += uRay * (sc * .22 + .14) * band * band;
  }

  // Specks drifting down in the current; they glow at night
  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    float sc = 58. - fk * 14.;
    vec2 q = p + vec2(t * (3. + fk * 2.), t * (5. + fk * 3.));
    vec2 g = q / sc, id = floor(g), f = fract(g) - .5;
    float r = h21(id + fk * 13.);
    if (r > .8 + .06 * (1. - uDark)) {
      vec2 o = (h22(id + fk) - .5) * .7;
      float dd = length(f - o) * sc;
      float size = .7 + fk * .45;
      float pulse = mix(.8, .35 + .65 * pow(.5 + .5 * sin(t * (1. + r) + r * 60.), 3.), uDark);
      col += uSnow * (1. - smoothstep(size, size + px * 1.2, dd)) * (.14 + .14 * fk) * pulse;
      col += uSnow * exp(-dd / 5.) * .1 * uDark * pulse;
    }
  }

  // Streams of tiny bubbles rising from the floor
  for (int k = 0; k < 4; k++) {
    vec2 st = STREAMS[k];
    if (abs(p.x - st.x) > 24.) continue;
    for (int b = 0; b < 7; b++) {
      float fb = float(b);
      float ph = fract(t * st.y * .028 + fb / 7. + h11(fb + float(k) * 7.));
      float by = floorY(st.x) + ph * 880.;
      float bx = st.x + sin(by * .03 + fb * 2.) * (4. + ph * 8.);
      float r = 1.4 + 1.6 * h11(fb * 3. + float(k));
      float dd = length(p - vec2(bx, by));
      float ring = (1. - smoothstep(r, r + px, dd)) * (.35 + .65 * smoothstep(r - 1.2, r, dd));
      col += uRay * ring * .5 * (1. - ph * .6);
    }
  }

  // Sandy floor under moving caustics, softened by the water in front
  float fl = floorY(p.x);
  float fcov = clamp((fl - p.y) / px + .5, 0., 1.);
  if (fcov > 0.) {
    vec3 sand = uSand * (.86 + .16 * fbm2(p * vec2(.02, .07)));
    sand *= .8 + .2 * smoothstep(fl - 70., fl, p.y);
    float ca = caustic(p * vec2(.013, .026), t * .55);
    sand += uRay * ca * (.26 - .16 * uDark);
    sand = mix(sand, uDeep, .3);
    col = mix(col, sand, fcov);
  }

  // Seagrass leaning and swaying in the current
  for (int k = 0; k < 14; k++) {
    vec4 gb = GRASS[k];
    if (abs(p.x - gb.x) > 70.) continue;
    float base = floorY(gb.x) - 6.;
    float h = (p.y - base) / gb.y;
    if (h < 0. || h > 1.) continue;
    float sway = sin(t * .55 + gb.w + h * 2.2) * 22. * pow(h, 1.4) + 14. * h * h;
    float w = gb.z * pow(1. - h, .55) + .6;
    float cov = clamp((w - abs(p.x - gb.x - sway)) / px + .5, 0., 1.);
    vec3 gc = uGrass * (.75 + .45 * h) * (.85 + .15 * sin(gb.w * 3.));
    col = mix(col, mix(gc, uMid, .18 * (1. - h)), cov * .92);
  }

  // Deeper at the corners
  vec2 v = gl_FragCoord.xy / uRes - .5;
  col *= 1. - .28 * smoothstep(.35, .95, length(v * vec2(1.1, 1.3)));
  col += (h21(gl_FragCoord.xy) - .5) / 255.;
  outColor = vec4(col, 1.);
}
`;

import { NOISE_GLSL } from './gl';

// Dynamic wallpaper. 1440×900 design space, y up from the bottom, x from the
// center; the terrain is procedural, so wider screens see more of it.
export const DYNAMIC_FS = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uSkyTop, uSkyMid, uSkyHor;
uniform vec3 uHill0, uHill1, uHill2, uHill3;
uniform vec3 uGlow;  uniform float uGlowA;
uniform float uNight;
uniform vec3 uCloud; uniform float uCloudA;
uniform vec3 uSun;   uniform vec2 uSunPos;
uniform vec2 uMoonPos; uniform float uMoonA;
uniform float uMist;
uniform float uDim;
${NOISE_GLSL}

const float HORIZON = 366.;
const float BASE[6] = float[6](380., 336., 282., 220., 150., 74.);
const float AMP[6]  = float[6](30., 40., 50., 54., 50., 40.);
const float FREQ[6] = float[6](.0042, .0034, .0029, .0025, .0021, .0017);
const float HAZE[6] = float[6](.5, .33, .2, .1, .04, 0.);

float px;   // one screen pixel in scene units

float grove(float x, float s) { return smoothstep(.46, .62, n1(x * .0045 + s)); }

float ridgeBase(int i, float x) {
  return BASE[i] + AMP[i] * (fbm1(x * FREQ[i] + float(i) * 31.7) - .5) * 2.;
}

float ridge(int i, float x) {
  float fi = float(i);
  float r = ridgeBase(i, x);
  if (i == 0) r += 2.5 * fbm1(x * .21 + 4.);                                       // far woodland edge
  if (i == 1) r += grove(x, 3.) * (5. + 5. * fbm1(x * .12));
  if (i == 2) r += grove(x, 9.) * (8. + 8. * fbm1(x * .075 + 2.));
  if (i >= 4) r += .9 * n1(x * .8 + fi) + .6 * n1(x * 2.1 + fi);                   // grass tufts
  return r;
}

vec3 hillColor(int i) {
  float t = float(i) * .6;
  vec3 c = mix(uHill0, uHill1, clamp(t, 0., 1.));
  c = mix(c, uHill2, clamp(t - 1., 0., 1.));
  return mix(c, uHill3, clamp(t - 2., 0., 1.));
}

// Live oak: a broad, billowing dome much wider than tall, on a short, thick
// trunk that forks low. Returns coverage; shade gets the crown's light and
// dark clumps.
float oak(vec2 p, vec2 base, float sz, float seed, out float shade) {
  vec2 q = (p - base) / sz;
  shade = 1.;
  if (abs(q.x) > 1.9 || q.y < -.1 || q.y > 1.9) return 0.;
  float lean = sin(seed) * .1;
  float trunk = max(abs(q.x - lean * q.y) - (.12 - q.y * .04), max(-q.y, q.y - .62));
  float fork = max(abs(q.x - lean * .6 - (q.y - .4) * 1.1) - .05, max(.4 - q.y, q.y - .85));
  fork = min(fork, max(abs(q.x - lean * .6 + (q.y - .42) * .95) - .045, max(.42 - q.y, q.y - .82)));
  vec2 c = (q - vec2(lean * .8, .98)) / vec2(1.42, .66);
  float leaf = fbm2(q * 2.6 + seed * 7.);
  float crown = length(c) - (.8 + .5 * (leaf - .5));
  crown = max(crown * .62, .6 - q.y - .12 * leaf);                                   // gently flattened underside
  float d = min(min(trunk, fork), crown) * sz;
  float cov = clamp(.5 - d / px, 0., 1.);
  // clumps of leaves: lit on top, darker underneath
  shade = crown < trunk
    ? .74 + .34 * smoothstep(.75, 1.45, q.y) + .22 * (fbm2(q * 6. + seed) - .5)
    : .62;
  return cov;
}

float capsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a, ba = b - a;
  return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)) - r;
}

// A horse in profile, hooves at base, one body length = sz. graze lowers
// the head to the grass. Returns coverage; lit gets light along its back.
float horse(vec2 p, vec2 base, float sz, float dir, float graze, out float lit) {
  vec2 q = (p - base) / sz;
  q.x *= dir;
  lit = 1.;
  if (abs(q.x) > 1.1 || q.y < -.05 || q.y > 1.2) return 0.;
  float d = (length((q - vec2(0., .63)) / vec2(.44, .165)) - 1.) * .165;
  d = min(d, length(q - vec2(.29, .62)) - .165);                                  // chest
  d = min(d, length(q - vec2(-.3, .66)) - .175);                                  // hindquarters
  d = min(d, capsule(q, vec2(.3, .52), vec2(.33, .02), .034));                    // forelegs
  d = min(d, capsule(q, vec2(.19, .52), vec2(.15, .02), .034));
  d = min(d, capsule(q, vec2(-.28, .58), vec2(-.35, .3), .05));                   // hind legs, hock bent back
  d = min(d, capsule(q, vec2(-.35, .3), vec2(-.31, .02), .03));
  d = min(d, capsule(q, vec2(-.38, .58), vec2(-.46, .31), .045));
  d = min(d, capsule(q, vec2(-.46, .31), vec2(-.43, .02), .03));
  vec2 n0 = vec2(.34, .7);
  vec2 n1 = mix(vec2(.56, 1.), vec2(.6, .3), graze);
  vec2 hd = mix(vec2(.76, .86), vec2(.64, .05), graze);
  d = min(d, capsule(q, n0, n1, .08));                                            // neck
  d = min(d, capsule(q, n1, hd, .052));                                           // head
  d = min(d, capsule(q, n1 + vec2(-.02, .02), n1 + mix(vec2(-.02, .12), vec2(.06, .02), graze), .018)); // ears
  d = min(d, capsule(q, vec2(-.46, .7), vec2(-.56, .34), .032 + .015 * q.y));     // tail
  lit = .8 + .45 * smoothstep(.62, .82, q.y);
  return clamp(.5 - d * sz / px, 0., 1.);
}

vec3 skyColor(vec2 p) {
  float y = p.y;
  float t = clamp((y - HORIZON) / (900. - HORIZON), 0., 1.);
  vec3 c = mix(uSkyHor, uSkyMid, smoothstep(0., .42, t));
  c = mix(c, uSkyTop, smoothstep(.42, 1., t));

  // Night: stars, a faint band of the Milky Way, the moon
  if (uNight > .01) {
    float fade = smoothstep(HORIZON + 30., HORIZON + 240., y) * uNight;
    vec2 g = p / 9.;
    vec2 id = floor(g), f = fract(g) - .5;
    float r = h21(id + 17.);
    if (r > .9) {
      vec2 o = (h22(id) - .5) * .6;
      float d = length(f - o) * 9.;
      float b = (r - .9) * 10.;
      float tw = .7 + .3 * sin(uTime * (.8 + 2. * h21(id + 3.)) + r * 40.);
      c += vec3(1., .97, .92) * b * b * tw * (1. - smoothstep(0., max(1.1, px * 1.1), d)) * fade;
    }
    vec2 dir = normalize(vec2(1., -.52));
    float dl = abs(dot(p - vec2(-300., 880.), vec2(-dir.y, dir.x)));
    float band = exp(-dl * dl / (2. * 95. * 95.));
    c += vec3(.72, .78, 1.) * band * fbm2(p * .009) * fbm2(p * .03 + 5.) * .5 * fade;
    float dm = length(p - uMoonPos);
    float disk = (1. - smoothstep(15.5, 16.5, dm)) * smoothstep(13.8, 14.8, length(p - uMoonPos - vec2(7., 4.)));
    c += vec3(.94, .95, 1.) * disk * uMoonA + vec3(.55, .63, .9) * exp(-dm / 70.) * .16 * uMoonA;
  }

  // Sun and its glow
  float ds = length(p - uSunPos);
  float day = 1. - uNight;
  c += uGlow * uGlowA * (.5 * exp(-ds / 230.) + .45 * exp(-abs(y - HORIZON) / 75.) * exp(-abs(p.x - uSunPos.x) / 560.));
  c += uSun * ((1. - smoothstep(18.5, 20., ds)) * .85 + exp(-ds / 30.) * .22 + exp(-ds / 120.) * .1) * day;

  // Cumulus: flat bases, billowing tops, lit from above and from the sun's side
  if (uCloudA > .01) {
    vec2 cp = vec2(p.x * .0042 + uTime * .0045, y * .0068);
    float base = 510. + 70. * n1(p.x * .0017 + 5.);
    float bandC = smoothstep(base - 6., base + 34., y) * (1. - smoothstep(760., 900., y));
    float n = fbm2(cp);
    float m = n - (1. - bandC) * .35;
    float dens = smoothstep(.55, .68, m);
    if (dens > 0.) {
      vec2 toSun = normalize(uSunPos - p + vec2(0., 1.));
      float n2s = fbm2(cp + toSun * vec2(.06, .1));
      float up = smoothstep(base, base + 150., y);
      float lit = clamp(.4 + .5 * up + (n - n2s) * 3.2, 0., 1.);
      vec3 shadowC = mix(uSkyMid, uHill0, .4) * .9;
      vec3 cc = mix(shadowC, uCloud, lit);
      cc += uGlow * uGlowA * exp(-ds / 320.) * (1. - dens) * 1.2;               // bright rims near the sun
      c = mix(c, cc, dens * uCloudA);
    }
    // High, thin streaks
    float ci = fbm2(vec2(p.x * .0009 + uTime * .0014, y * .02 + 3.));
    c = mix(c, uCloud, smoothstep(.58, .84, ci) * smoothstep(600., 800., y) * .28 * uCloudA);
  }
  return c;
}

// Oaks: x, size, seed, layer
const vec4 OAKS[6] = vec4[6](
  vec4(-560., 46., 1.3, 4.), vec4(610., 38., 4.1, 4.),
  vec4(-250., 25., 2.2, 3.), vec4(640., 29., 5.7, 3.), vec4(150., 17., 8.9, 3.),
  vec4(-40., 12., 3.3, 2.)
);

void main() {
  float s = uRes.y / 900.;
  px = 1. / s;
  vec2 p = vec2(gl_FragCoord.x - uRes.x * .5, gl_FragCoord.y) / s;

  vec3 hazeC = mix(uSkyHor, uSkyMid, .4);
  vec3 mistC = mix(uSkyHor, vec3(1.), .28) + uGlow * uGlowA * .12;
  // shadows fall away from the sun
  float shadowDir = clamp(-uSunPos.x / 500., -1.2, 1.2);
  float shadowK = (1. - uNight) * smoothstep(HORIZON - 20., HORIZON + 80., uSunPos.y);
  vec3 acc = vec3(0.);
  float A = 0.;
  float rNear = -1e5;

  // Front to back, stopping at the first solid ridge
  for (int i = 5; i >= 0; i--) {
    float r = ridge(i, p.x);
    float cov = clamp((r - p.y) / px + .5, 0., 1.);
    float tree = 0., shade = 1., shadow = 0.;
    for (int k = 0; k < 6; k++) {
      if (int(OAKS[k].w) != i) continue;
      vec2 base = vec2(OAKS[k].x, ridge(i, OAKS[k].x) - OAKS[k].y * .12);
      float sh;
      float o = oak(p, base, OAKS[k].y, OAKS[k].z, sh);
      if (o > tree) { tree = o; shade = sh; }
      // a soft pool of shade on the grass beside the trunk
      vec2 e = (p - base - vec2(shadowDir * OAKS[k].y * .9, -OAKS[k].y * .06)) / vec2(OAKS[k].y * 1.7, OAKS[k].y * .16);
      shadow = max(shadow, (1. - smoothstep(.55, 1., length(e))) * shadowK);
    }
    float horseA = 0., horseLit = 1.;
    if (i == 4) {
      float hl;
      float h = horse(p, vec2(392., ridgeBase(4, 392.) - 16.), 34., -1., 1., hl); if (h > horseA) { horseA = h; horseLit = hl; }
      h = horse(p, vec2(456., ridgeBase(4, 456.) - 24.), 36., 1., 0., hl); if (h > horseA) { horseA = h; horseLit = hl; }
    }
    float a = max(max(cov, tree), horseA);
    if (a > 0.) {
      vec3 c = hillColor(i);
      float depth = r - p.y;
      // sunlit crest, gentle shade further down each slope
      c += uGlow * exp(-max(depth, 0.) / 16.) * (.05 + .2 * uGlowA) * (1. - float(i) * .12);
      c *= mix(1., .87, smoothstep(0., 170., depth));
      if (i >= 3) c *= .9 + .14 * fbm2(p * vec2(.007, .026) + float(i) * 7.) + .03 * n2(p * .6);
      c *= 1. - .3 * shadow;
      // a black three-board fence running along the middle pasture
      if (i == 3) {
        float fy = r - 30. - 10. * n1(p.x * .0035 + 3.);
        float run = smoothstep(.3, .36, n1(p.x * .0021 + 9.));
        float post = step(mod(p.x + 11., 46.), 2.1) * step(fy, p.y) * step(p.y, fy + 21.);
        float rail = 0.;
        for (int k = 0; k < 3; k++) rail = max(rail, 1. - smoothstep(.7, .7 + px, abs(p.y - fy - 8. - float(k) * 6.)));
        c = mix(c, c * .24, max(post, rail) * run * .85);
      }
      if (tree > 0.) c = mix(c, hillColor(i) * .7 * shade + uGlow * uGlowA * .05, tree);
      // bay horses by day, silhouettes at night
      if (horseA > 0.) c = mix(c, mix(hillColor(i) * .4, vec3(.36, .22, .14) * horseLit + uGlow * uGlowA * .06, 1. - uNight), horseA);
      c = mix(c, hazeC, HAZE[i]);
      // mist pooling in the valley in front of this ridge
      if (i < 5) c = mix(c, mistC, uMist * exp(-max(0., p.y - rNear) / 24.) * (.35 + .12 * float(5 - i)));
      acc += (1. - A) * a * c;
      A += (1. - A) * a;
    }
    if (A > .998) break;
    rNear = ridgeBase(i, p.x);
  }
  if (A < .998) {
    vec3 sky = skyColor(p);
    sky = mix(sky, mistC, uMist * .5 * exp(-max(0., p.y - rNear) / 40.));
    acc += (1. - A) * sky;
  }

  // Low sun glare over everything, then dusk-proofing for dark mode
  float ds = length(p - uSunPos);
  acc += uSun * exp(-ds / 190.) * .1 * (1. - uNight) * smoothstep(HORIZON - 60., HORIZON + 40., uSunPos.y);
  acc = mix(acc, acc * vec3(.66, .7, .82), uDim);
  acc += (h21(gl_FragCoord.xy) - .5) / 255.;
  outColor = vec4(acc, 1.);
}
`;

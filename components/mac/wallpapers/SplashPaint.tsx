'use client';
import { useEffect, useRef, useState } from 'react';
import { afterLoad, getGL, hexRGB, makeProgram, nextIdle, prefersStill, whenLinked } from './gl';

// Splash wallpaper. Each splat draws into offscreen color and thickness
// textures, then a full-screen pass lights the thickness.

const ARRIVE = .22;        // seconds a thrown blob is in the air
const MAX_SPOKES = 40, MAX_SATS = 24, MAX_SPAT = 16, MAX_DRIPS = 3;
const SLOTS = 14, CLICK_SLOTS = 6;
const PALETTE = ['#0A84FF', '#FF375F', '#FFD60A', '#30D158', '#BF5AF2', '#64D2FF', '#FF9F0A'].map(hexRGB);
enum Kind { HeadOn, Angled, Flick }

const QUAD_VS = `#version 300 es
in vec2 aPos;
uniform vec4 uBounds;
uniform vec2 uRes;
void main() {
  vec2 px = mix(uBounds.xy, uBounds.zw, aPos);
  gl_Position = vec4(px.x / uRes.x * 2. - 1., 1. - px.y / uRes.y * 2., 0., 1.);
}`;

// Local splat space: units of the splat's size, +x the way the paint was
// travelling. Drips work in screen space, since they run down the page.
const SPLAT_FS = `#version 300 es
precision highp float;
layout(location = 0) out vec4 oColor;
layout(location = 1) out vec4 oGeo;
uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uScale, uRot, uAge, uFade;
uniform int uKind;
uniform vec3 uColor;
uniform float uSpokes[${MAX_SPOKES}];
uniform int uN;
uniform vec3 uSats[${MAX_SATS}];
uniform int uNS;
uniform vec4 uSpat[${MAX_SPAT}];
uniform int uNP;
uniform vec4 uDrips[${MAX_DRIPS}];
uniform vec2 uDripT[${MAX_DRIPS}];
uniform int uND;

float smin(float a, float b, float k) {
  float h = clamp(.5 + .5 * (b - a) / k, 0., 1.);
  return mix(b, a, h) - k * h * (1. - h);
}
float capsule(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0., 1.);
  return length(pa - ba * h) - mix(ra, rb, h);
}
float spoke(int i) { return uSpokes[i % uN]; }
// Catmull-Rom through the spoke radii: long spokes between short
// neighbors come out as rounded fingers
float radiusAt(float ang, float grow) {
  float f = (ang / 6.2831853 + 1.) * float(uN);
  int i = int(floor(f));
  float t = fract(f);
  float p0 = spoke(i + uN - 1), p1 = spoke(i), p2 = spoke(i + 1), p3 = spoke(i + 2);
  p0 = mix(min(p0, 1.05), p0, grow); p1 = mix(min(p1, 1.05), p1, grow);
  p2 = mix(min(p2, 1.05), p2, grow); p3 = mix(min(p3, 1.05), p3, grow);
  return .5 * (2. * p1 + (p2 - p0) * t + (2. * p0 - 5. * p1 + 4. * p2 - p3) * t * t + (3. * p1 - p0 - 3. * p2 + p3) * t * t * t);
}

void main() {
  vec2 fp = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 sp = (fp - uCenter) / uScale;                     // screen-aligned units, y down
  float cr = cos(uRot), sr = sin(uRot);
  vec2 q = mat2(cr, -sr, sr, cr) * sp;                   // local: +x = direction of travel
  float d = 1e5;
  float soft = 1.;

  if (uAge < 0.) {
    // In the air: straight at the page it recedes (and comes into focus);
    // at an angle it flies in from behind, stretched by its speed
    float a = 1. + uAge / ${ARRIVE};
    if (uKind == 0) {
      d = length(q) - .5 * mix(2.4, 1., a * a);
      soft = mix(5., 1., a);
    } else if (uKind == 1) {
      vec2 c = vec2(-4.2 * (1. - a), 0.);
      d = (length((q - c) / vec2(1.7, 1.)) - .48) * .9;
    }
  } else {
    float tau = uAge;
    if (uN > 0) {
      float spread = .35 + .65 * (1. - exp(-tau * 11.) * cos(tau * 13.));
      float grow = smoothstep(.02, .26, tau);
      d = (length(q) - radiusAt(atan(q.y, q.x), grow) * spread) * .82;
      // droplets pinching off the finger tips, merging where they touch
      float sa = smoothstep(.04, .12, tau);
      for (int k = 0; k < ${MAX_SATS}; k++) {
        if (k >= uNS) break;
        vec3 s = uSats[k];
        d = smin(d, length(q - s.xy * mix(.66, 1., smoothstep(.03, .3, tau)) * spread) - s.z * sa, .1);
      }
    }
    // spatter: flies out, the furthest landing last, and lands as a
    // teardrop whose tail points the way it was going
    for (int k = 0; k < ${MAX_SPAT}; k++) {
      if (k >= uNP) break;
      vec4 s = uSpat[k];
      float dist = length(s.xy);
      float land = uKind == 2 ? .012 + dist * .028 : .02 + dist * .032;
      float u = clamp((tau - land + .07) / .07, 0., 1.);
      if (u <= 0.) continue;
      vec2 dir = s.xy / max(dist, .001);
      vec2 c = uKind == 2 ? s.xy : s.xy * mix(.45, 1., u);
      float r = s.z * mix(.55, 1., u);
      float tail = u >= 1. ? s.z * (s.w - 1.) * 1.6 : s.z * (s.w - 1.) * 2.4 * u;
      d = min(d, capsule(q, c, c + dir * tail, r, r * .38));
    }
    // paint running down the page from the lower rim
    for (int k = 0; k < ${MAX_DRIPS}; k++) {
      if (k >= uND) break;
      vec4 dr = uDrips[k];
      float start = uDripT[k].x;
      if (tau < start) continue;
      float L = dr.z * (1. - exp(-(tau - start) / uDripT[k].y));
      vec2 a = dr.xy;
      vec2 b = a + vec2(sin(float(k) * 2.3 + dr.x * 4.) * .06 * L, L);
      float dd = capsule(sp, a, b, dr.w, dr.w * .7);
      dd = min(dd, length(sp - b - vec2(0., dr.w * .3)) - dr.w * 1.35);
      d = smin(d, dd, .14);
    }
  }
  float dpx = d * uScale;
  float cov = clamp(.5 - dpx / soft, 0., 1.);
  if (cov <= 0.) discard;
  float rim = clamp(uScale * .11, 2., 4.5);
  float h = smoothstep(0., rim, -dpx) * .8 + smoothstep(0., rim * 5., -dpx) * .2;
  float wet = 1. - .72 * smoothstep(.2, 5., uAge);
  // a blob still in the air is fading into view
  float air = uAge < 0. ? smoothstep(-${ARRIVE}, -${ARRIVE} * .6, uAge) : 1.;
  oColor = vec4(uColor * cov, cov) * uFade * air;
  oGeo = vec4(h * cov, wet * cov, 0., cov) * uFade * air;
}`;

const LIGHT_FS = `#version 300 es
precision highp float;
out vec4 outColor;
uniform sampler2D uPaint, uGeo;
uniform vec2 uRes;
uniform vec3 uPaper;
uniform float uDark, uPx;
float h21(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float n2(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y);
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 tx = 1. / uRes;
  vec4 c = texture(uPaint, uv);
  vec4 g = texture(uGeo, uv);
  float o = 1.5 * uPx;
  float hL = texture(uGeo, uv - vec2(tx.x * o, 0.)).r, hR = texture(uGeo, uv + vec2(tx.x * o, 0.)).r;
  float hD = texture(uGeo, uv - vec2(0., tx.y * o)).r, hU = texture(uGeo, uv + vec2(0., tx.y * o)).r;
  vec3 n = normalize(vec3((hL - hR) * 1.5, (hD - hU) * 1.5, 1.));

  // Paper with a little tooth
  vec2 p = gl_FragCoord.xy / uPx;
  float grain = n2(p * .45) * .45 + n2(p * 1.3) * .35 + n2(p * .06) * .2;
  vec3 paper = uPaper * (.968 + .05 * grain);
  // paint lifts off the page: a soft shadow down and to the right
  float sh = 0.;
  for (int k = 1; k <= 4; k++) sh += texture(uPaint, uv + vec2(-.8, 1.2) * tx * float(k) * uPx).a;
  paper *= 1. - (.05 + .07 * (1. - uDark)) * sh * (1. - c.a);

  vec3 paint = c.a > .001 ? c.rgb / c.a : vec3(0.);
  float gloss = g.a > .001 ? g.g / g.a : 0.;
  vec3 L = normalize(vec3(-.45, .55, .72));
  float diff = clamp(dot(n, L), 0., 1.);
  float spec = pow(max(dot(n, normalize(L + vec3(0., 0., 1.))), 0.), 90.) * (.1 + .9 * gloss);
  float edge = 1. - n.z;
  vec3 lit = paint * (.86 + .2 * diff - .18 * edge) + spec * (.7 + .25 * uDark);
  vec3 col = mix(paper, lit, c.a);
  col += (h21(gl_FragCoord.xy) - .5) / 255.;
  outColor = vec4(col, 1.);
}`;

type Splat = {
  x: number; y: number; scale: number; rot: number; color: number[]; kind: Kind;
  spokes: Float32Array; n: number;
  sats: Float32Array; ns: number;
  spat: Float32Array; np: number;
  drips: Float32Array; dripT: Float32Array; nd: number;
  born: number; life: number; ext: number;
};

function rng(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Same Catmull-Rom as the shader, fully grown, to find the rim
function rimAt(spokes: Float32Array, n: number, ang: number) {
  const f = (ang / (Math.PI * 2) + 2) * n;
  const i = Math.floor(f), t = f - i;
  const s = (k: number) => spokes[((k % n) + n) % n];
  const p0 = s(i - 1), p1 = s(i), p2 = s(i + 1), p3 = s(i + 2);
  return .5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t * t * t);
}

function makeSplat(rnd: () => number, x: number, y: number, born: number, force?: Kind): Splat {
  const roll = rnd();
  const kind = force ?? (roll < .42 ? Kind.HeadOn : roll < .82 ? Kind.Angled : Kind.Flick);
  const rot = rnd() * Math.PI * 2;
  const spokes = new Float32Array(MAX_SPOKES);
  const sats: number[] = [], spat: number[] = [];
  let n = 0, ext = 1.4;

  if (kind === Kind.Flick) {
    // a flick of the brush: separate droplets strung along a slight curve,
    // big to small, with a little space between each
    const count = 7 + Math.floor(rnd() * 6), bend = (rnd() - .5) * .5;
    let dist = .3;
    for (let i = 0; i < count && spat.length < MAX_SPAT * 4; i++) {
      const t = i / (count - 1);
      const r = (.4 - .3 * t) * (.75 + rnd() * .5), w = 1.2 + t * 1.6 + rnd() * .4;
      const a = bend * t * t + (rnd() - .5) * .12;
      spat.push(Math.cos(a) * dist, Math.sin(a) * dist, r, w);
      ext = Math.max(ext, dist + r * w * 2 + .5);
      dist += r * (1 + w * 1.6) + .25 + rnd() * .6;
      // the odd fleck knocked off to the side
      if (rnd() < .3 && spat.length < MAX_SPAT * 4) {
        const side = (rnd() < .5 ? -1 : 1) * (.35 + rnd() * .4);
        spat.push(Math.cos(a) * dist - Math.sin(a) * side, Math.sin(a) * dist + Math.cos(a) * side, .04 + rnd() * .05, 1.3);
      }
    }
  } else {
    // a splat: round body with a crinkled rim; thrown at an angle it bulges
    // and fingers out the way it was going
    const strength = kind === Kind.Angled ? .55 + rnd() * .45 : rnd() * .2;
    const oval = rnd() * .14, tilt = rnd() * Math.PI;
    n = 30 + Math.floor(rnd() * 9);
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2, front = Math.max(0, Math.cos(ang)), back = Math.max(0, -Math.cos(ang));
      let r = (.88 + rnd() * .18) * (1 + oval * Math.cos(2 * (ang - tilt))) * (1 + .5 * strength * front * front - .15 * strength * back);
      if (rnd() < .3) r += .06 + rnd() * .14;
      if (rnd() < .1 + .42 * strength * front * front) {
        r = (1.3 + rnd() * .75) * (1 + .55 * strength * front);
        if (sats.length < MAX_SATS * 3) sats.push(Math.cos(ang) * (r - .04), Math.sin(ang) * (r - .04), .09 + rnd() * .05);
        const drops = Math.floor(rnd() * 3);
        for (let k = 0; k < drops && sats.length < MAX_SATS * 3; k++) {
          const dist = r * (1.16 + rnd() * .4 + k * .26), j = (rnd() - .5) * .16;
          sats.push(Math.cos(ang + j) * dist, Math.sin(ang + j) * dist, Math.max(.035, .12 - k * .04 - rnd() * .04));
          ext = Math.max(ext, dist + .2);
        }
      }
      spokes[i] = r;
      ext = Math.max(ext, r + .2);
    }
    // a fine spray around the rim
    const spray = 4 + Math.floor(rnd() * 6);
    for (let k = 0; k < spray && sats.length < MAX_SATS * 3; k++) {
      const a = kind === Kind.Angled ? (rnd() - .5) * 2.4 : rnd() * Math.PI * 2, dist = 1.25 + rnd() * .8;
      sats.push(Math.cos(a) * dist, Math.sin(a) * dist, .025 + rnd() * .045);
      ext = Math.max(ext, dist + .15);
    }
    // spatter thrown further: all around when it hit head-on, fanned out
    // ahead (and longer) when it came in at an angle
    const count = kind === Kind.Angled ? 7 + Math.floor(rnd() * 8) : 3 + Math.floor(rnd() * 5);
    for (let k = 0; k < count; k++) {
      const a = kind === Kind.Angled ? (rnd() - .5) * 1.5 : rnd() * Math.PI * 2;
      const dist = 1.7 + rnd() * (kind === Kind.Angled ? 4.4 : 2.6);
      const r = Math.max(.035, .2 - dist * .028) * (.55 + rnd() * .8);
      spat.push(Math.cos(a) * dist, Math.sin(a) * dist, r, kind === Kind.Angled ? 1.4 + dist * .5 : 1 + rnd() * .5);
      ext = Math.max(ext, dist + r * 6);
    }
  }

  // Runs start on the lower rim wherever the paint is, each on its own
  // schedule: some never run, some run twice, a few reach a long way.
  // A flick's droplets are too small to run.
  const drips = new Float32Array(MAX_DRIPS * 4), dripT = new Float32Array(MAX_DRIPS * 2);
  const want = kind === Kind.Flick ? 0 : [0, 1, 1, 1, 2, 2, 3][Math.floor(rnd() * 7)];
  let nd = 0;
  for (let k = 0; k < want; k++) {
    const down = Math.PI / 2 + (rnd() - .5) * 1.5;                       // screen angle, around straight down
    const R = rimAt(spokes, n, down - rot);
    const sx = Math.cos(down) * R * .8, sy = Math.sin(down) * R * .8;
    const w = .07 + rnd() * .07;
    const len = rnd() < .25 ? .6 + rnd() * .8 : 1.6 + rnd() * 3.6;
    drips.set([sx, sy, len, w], nd * 4);
    dripT.set([.3 + rnd() * 2.6, .9 + rnd() * 2.6], nd * 2);
    ext = Math.max(ext, Math.hypot(sx, sy + len) + w * 3);
    nd++;
  }

  // mostly middling, now and then a big one; colors vary a touch
  const base = PALETTE[Math.floor(rnd() * PALETTE.length)];
  const lift = (rnd() - .4) * .16;
  const color = base.map(c => Math.min(1, Math.max(0, c + lift * (lift > 0 ? 1 - c : c))));
  const size = 11 + Math.pow(rnd(), 1.6) * 24;
  return {
    x, y, scale: kind === Kind.Flick ? size * .8 : size, rot, color, kind,
    spokes, n,
    sats: new Float32Array([...sats, ...new Array(MAX_SATS * 3 - sats.length).fill(0)]), ns: sats.length / 3,
    spat: new Float32Array([...spat, ...new Array(MAX_SPAT * 4 - spat.length).fill(0)]), np: spat.length / 4,
    drips, dripT, nd,
    born, life: 15 + rnd() * 9, ext: Math.max(ext, kind === Kind.Angled ? 4.8 : 1.4),
  };
}

export default function SplashPaint({ dark, onFail }: { dark: boolean; onFail: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const darkRef = useRef(dark);
  darkRef.current = dark;
  const failRef = useRef(onFail);
  failRef.current = onFail;
  const redraw = useRef<() => void>(() => {});
  useEffect(() => { redraw.current(); }, [dark]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    ref.current!.appendChild(canvas);
    let dead = false, raf = 0, gl: WebGL2RenderingContext | null = null;
    const cleanups: (() => void)[] = [];

    const cancel = afterLoad(async () => {
      gl = await getGL(canvas);
      if (dead) return;
      if (!gl) { failRef.current(); return; }
      const g = gl;
      const splatProg = makeProgram(g, QUAD_VS, SPLAT_FS);
      const lightProg = makeProgram(g, `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos * 2. - 1., 0., 1.); }`, LIGHT_FS);
      const ok = (await whenLinked(g, splatProg)) && (await whenLinked(g, lightProg));
      if (dead) return;
      if (!ok) { failRef.current(); return; }
      await nextIdle();
      if (dead) return;

      const still = prefersStill();
      const vao = g.createVertexArray();
      g.bindVertexArray(vao);
      const buf = g.createBuffer();
      g.bindBuffer(g.ARRAY_BUFFER, buf);
      g.bufferData(g.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), g.STATIC_DRAW);
      for (const prog of [splatProg, lightProg]) {
        const l = g.getAttribLocation(prog, 'aPos');
        g.enableVertexAttribArray(l);
        g.vertexAttribPointer(l, 2, g.FLOAT, false, 0, 0);
      }
      const U = (prog: WebGLProgram) => {
        const m = new Map<string, WebGLUniformLocation | null>();
        return (n: string) => { if (!m.has(n)) m.set(n, g.getUniformLocation(prog, n)); return m.get(n)!; };
      };
      const us = U(splatProg), ul = U(lightProg);

      // Offscreen color + thickness targets, rebuilt on resize
      const fb = g.createFramebuffer();
      const texs = [g.createTexture()!, g.createTexture()!];
      let W = 0, H = 0, dpr = 1;
      const size = () => {
        const cw = canvas.clientWidth, ch = canvas.clientHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (cw * ch * dpr * dpr > 3.6e6) dpr = Math.sqrt(3.6e6 / (cw * ch));
        const w = Math.max(1, Math.round(cw * dpr)), h = Math.max(1, Math.round(ch * dpr));
        if (w === W && h === H) return;
        W = canvas.width = w; H = canvas.height = h;
        g.bindFramebuffer(g.FRAMEBUFFER, fb);
        texs.forEach((t, i) => {
          g.bindTexture(g.TEXTURE_2D, t);
          g.texImage2D(g.TEXTURE_2D, 0, g.RGBA8, W, H, 0, g.RGBA, g.UNSIGNED_BYTE, null);
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
          g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0 + i, g.TEXTURE_2D, t, 0);
        });
        g.drawBuffers([g.COLOR_ATTACHMENT0, g.COLOR_ATTACHMENT1]);
        g.bindFramebuffer(g.FRAMEBUFFER, null);
      };

      // Splats: a painting already under way, then one throw at a time
      const rnd = rng((Date.now() / 1000) | 0);
      const now = () => performance.now() / 1000;
      const place = (live: Splat[]) => {
        const vw = canvas.clientWidth, vh = canvas.clientHeight;
        // now and then right beside another, so colors overlap
        if (live.length && rnd() < .22) {
          const o = live[Math.floor(rnd() * live.length)], a = rnd() * Math.PI * 2, r = 50 + rnd() * 70;
          return { x: Math.min(vw - 30, Math.max(30, o.x + Math.cos(a) * r)), y: Math.min(vh - 100, Math.max(50, o.y + Math.sin(a) * r)) };
        }
        // otherwise the best of a few random spots: furthest from the rest
        let best = { x: vw / 2, y: vh / 2 }, bestD = -1;
        for (let i = 0; i < 8; i++) {
          const c = { x: 40 + rnd() * (vw - 80), y: 60 + rnd() * (vh - 150) };
          const d = Math.min(1e9, ...live.map(s => Math.hypot(s.x - c.x, s.y - c.y)));
          if (d > bestD) { bestD = d; best = c; }
        }
        return best;
      };
      const splats: Splat[] = [];
      const t0 = now();
      for (let i = 0; i < SLOTS; i++) {
        const at = place(splats);
        splats.push(makeSplat(rnd, at.x, at.y, t0 - (still ? 8 : .5 + rnd() * 13)));
      }
      const clicks: Splat[] = [];
      // Throws are spaced out on their own clock, so even after the tab has
      // been in the background they come back one at a time
      let nextThrow = t0 + .8;

      const drawSplat = (s: Splat, t: number) => {
        const age = t - s.born;
        if (age < -ARRIVE || age > s.life) return;
        const fade = 1 - Math.min(1, Math.max(0, (age - (s.life - 2)) / 2));
        const cx = s.x * dpr, cy = s.y * dpr, sc = s.scale * dpr, e = s.ext * sc + 6;
        g.uniform4f(us('uBounds'), cx - e, cy - e, cx + e, cy + e);
        g.uniform2f(us('uCenter'), cx, cy);
        g.uniform1f(us('uScale'), sc);
        g.uniform1f(us('uRot'), s.rot);
        g.uniform1f(us('uAge'), age);
        g.uniform1f(us('uFade'), fade);
        g.uniform1i(us('uKind'), s.kind);
        g.uniform3fv(us('uColor'), s.color);
        g.uniform1fv(us('uSpokes'), s.spokes);
        g.uniform1i(us('uN'), s.n);
        g.uniform3fv(us('uSats'), s.sats);
        g.uniform1i(us('uNS'), s.ns);
        g.uniform4fv(us('uSpat'), s.spat);
        g.uniform1i(us('uNP'), s.np);
        g.uniform4fv(us('uDrips'), s.drips);
        g.uniform2fv(us('uDripT'), s.dripT);
        g.uniform1i(us('uND'), s.nd);
        g.drawArrays(g.TRIANGLES, 0, 6);
      };

      const draw = () => {
        if (g.isContextLost()) return;
        size();
        const t = still ? t0 : now();
        // retire finished splats; each replacement waits for its turn
        if (!still) {
          splats.forEach((s, i) => {
            if (t - s.born > s.life) {
              const at = place(splats.filter((_, j) => j !== i));
              const born = Math.max(nextThrow, t + .2) + ARRIVE;
              nextThrow = born + .5 + rnd() * 1.9;
              splats[i] = makeSplat(rnd, at.x, at.y, born);
            }
          });
        }
        g.bindFramebuffer(g.FRAMEBUFFER, fb);
        g.viewport(0, 0, W, H);
        g.clearColor(0, 0, 0, 0);
        g.clear(g.COLOR_BUFFER_BIT);
        g.enable(g.BLEND);
        g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA);
        g.useProgram(splatProg);
        g.bindVertexArray(vao);
        g.uniform2f(us('uRes'), W, H);
        // oldest first, so newer paint lands on top
        [...splats, ...clicks].sort((a, b) => a.born - b.born).forEach(s => drawSplat(s, t));
        g.disable(g.BLEND);
        g.bindFramebuffer(g.FRAMEBUFFER, null);
        g.viewport(0, 0, W, H);
        g.useProgram(lightProg);
        texs.forEach((tex, i) => { g.activeTexture(g.TEXTURE0 + i); g.bindTexture(g.TEXTURE_2D, tex); });
        g.uniform1i(ul('uPaint'), 0);
        g.uniform1i(ul('uGeo'), 1);
        g.uniform2f(ul('uRes'), W, H);
        g.uniform1f(ul('uPx'), dpr);
        g.uniform1f(ul('uDark'), darkRef.current ? 1 : 0);
        g.uniform3fv(ul('uPaper'), hexRGB(darkRef.current ? '#141416' : '#f7f5f0'));
        g.drawArrays(g.TRIANGLES, 0, 6);
      };

      // Full frame rate only while paint is moving; 15fps otherwise, idle once settled
      let last = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        const t = now();
        const all = [...splats, ...clicks];
        const lateRun = (s: Splat) => Math.max(0, ...Array.from({ length: s.nd }, (_, k) => s.dripT[k * 2] + s.dripT[k * 2 + 1] * 3));
        const fast = all.some(s => t - s.born > -ARRIVE - .05 && t - s.born < .7);
        const slow = all.some(s => t - s.born > -ARRIVE - .05 && (t - s.born < Math.max(5.5, lateRun(s)) || t - s.born > s.life - 2.1));
        const gap = fast ? 0 : slow ? 1 / 15 : 1;
        if (t - last < gap) return;
        last = t;
        draw();
      };
      redraw.current = () => draw();
      draw();
      setReady(true);
      if (!still) raf = requestAnimationFrame(frame);

      // A click on the empty desktop throws paint there
      const onDown = (e: PointerEvent) => {
        if (!(e.target as HTMLElement | null)?.hasAttribute?.('data-desktop')) return;
        const s = makeSplat(rnd, e.clientX, e.clientY, still ? now() - 8 : now() + ARRIVE);
        if (clicks.length >= CLICK_SLOTS) clicks.shift();
        clicks.push(s);
        if (still) draw();
      };
      window.addEventListener('pointerdown', onDown);
      const onResize = () => draw();
      window.addEventListener('resize', onResize);
      cleanups.push(() => { window.removeEventListener('pointerdown', onDown); window.removeEventListener('resize', onResize); });
    });

    const lost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); failRef.current(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => {
      dead = true;
      cancel();
      cancelAnimationFrame(raf);
      cleanups.forEach(f => f());
      redraw.current = () => {};
      canvas.removeEventListener('webglcontextlost', lost);
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, []);

  return <div ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: ready ? 1 : 0, transition: 'opacity .9s ease' }} />;
}

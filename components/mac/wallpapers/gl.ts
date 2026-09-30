// WebGL2 helpers for the shader wallpapers. Setup waits for idle time so it
// never delays first paint.

export const FULL_VS = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// Hash and value-noise helpers most wallpaper shaders start from (no sine
// hashes: those band on some GPUs at large coordinates)
export const NOISE_GLSL = `
float h11(float p) { p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float n1(float x) { float i = floor(x), f = fract(x); return mix(h11(i), h11(i + 1.), f * f * (3. - 2. * f)); }
float fbm1(float x) { float v = 0., a = .5; for (int i = 0; i < 4; i++) { v += a * n1(x); x = x * 2.07 + 13.7; a *= .5; } return v / .9375; }
float n2(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y);
}
float fbm2(vec2 p) {
  float v = 0., a = .5;
  for (int i = 0; i < 5; i++) { v += a * n2(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 7.3; a *= .5; }
  return v / .96875;
}
`;

// Resolves on the next idle callback
export function nextIdle() {
  const w = window as Window & { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number };
  return new Promise<void>(r => (w.requestIdleCallback ? w.requestIdleCallback(() => r(), { timeout: 400 }) : setTimeout(r, 30)));
}

// null for software rendering, which would be too slow
export async function getGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', {
    alpha: false, antialias: false, depth: false, stencil: false,
    premultipliedAlpha: true, preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) return null;
  // the first extension lookup waits on the GPU process; give it its own turn
  await nextIdle();
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)) {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return null;
  }
  gl.getExtension('KHR_parallel_shader_compile');
  await nextIdle();
  return gl;
}

export function makeProgram(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  return p;
}

// Resolves once the driver has finished linking; with
// KHR_parallel_shader_compile the wait happens without blocking
export function whenLinked(gl: WebGL2RenderingContext, p: WebGLProgram): Promise<boolean> {
  const ext = gl.getExtension('KHR_parallel_shader_compile');
  return new Promise(resolve => {
    const check = () => {
      if (gl.isContextLost()) return resolve(false);
      if (ext && !gl.getProgramParameter(p, ext.COMPLETION_STATUS_KHR)) { setTimeout(check, 16); return; }
      const ok = !!gl.getProgramParameter(p, gl.LINK_STATUS);
      if (!ok && process.env.NODE_ENV !== 'production') {
        console.warn('[wallpaper] shader failed:', gl.getProgramInfoLog(p),
          ...gl.getAttachedShaders(p)!.map(s => gl.getShaderInfoLog(s)));
      }
      resolve(ok);
    };
    check();
  });
}

// One triangle that covers the screen
export function fullscreen(gl: WebGL2RenderingContext, prog: WebGLProgram) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  return vao;
}

// Runs after load, once the browser is idle
export function afterLoad(cb: () => void) {
  let idle = 0, timer = 0;
  const w = window as Window & {
    requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const go = () => {
    if (w.requestIdleCallback) idle = w.requestIdleCallback(cb, { timeout: 900 });
    else timer = window.setTimeout(cb, 120);
  };
  if (document.readyState === 'complete') go();
  else window.addEventListener('load', go, { once: true });
  return () => {
    window.removeEventListener('load', go);
    if (idle) w.cancelIdleCallback?.(idle);
    if (timer) clearTimeout(timer);
  };
}

// Frame loop capped at `fps`; the callback gets seconds since start
export function runLoop(draw: (t: number) => void, fps: number) {
  let raf = 0, last = -1e9;
  const t0 = performance.now();
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (now - last < 1000 / fps - 3) return;
    last = now;
    draw((now - t0) / 1000);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

export const prefersStill = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Canvas backing size: device pixels up to maxDpr, and never more than
// maxPixels in total (5K screens get a lighter buffer, upscaled)
export function fitCanvas(canvas: HTMLCanvasElement, maxDpr: number, maxPixels: number) {
  const cw = canvas.clientWidth, ch = canvas.clientHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  if (cw * ch * dpr * dpr > maxPixels) dpr = Math.sqrt(maxPixels / (cw * ch));
  const w = Math.max(1, Math.round(cw * dpr)), h = Math.max(1, Math.round(ch * dpr));
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  return dpr;
}

export const hexRGB = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);

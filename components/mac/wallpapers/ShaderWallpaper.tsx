'use client';
import { useEffect, useRef, useState } from 'react';
import { FULL_VS, afterLoad, fitCanvas, fullscreen, getGL, makeProgram, nextIdle, prefersStill, runLoop, whenLinked } from './gl';

export type Uniforms = Record<string, number | number[]>;

// Full-screen fragment shader layer. Fades in after its first frame; onFail
// lets the caller keep its static version.
export default function ShaderWallpaper({ frag, uniforms, fps = 30, maxDpr = 1.5, maxPixels = 3.2e6, onFail }: {
  frag: string;
  uniforms: (t: number) => Uniforms;
  fps?: number;
  maxDpr?: number;
  maxPixels?: number;
  onFail?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const uni = useRef(uniforms);
  uni.current = uniforms;
  const failRef = useRef(onFail);
  failRef.current = onFail;
  const redraw = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);

  // New props (theme, hour) show right away, even when the loop is off
  useEffect(() => { redraw.current(); }, [uniforms]);

  useEffect(() => {
    // A fresh canvas per run: a context released on cleanup can't be reused
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    ref.current!.appendChild(canvas);
    let stop = () => {};
    let dead = false;
    let gl: WebGL2RenderingContext | null = null;

    const cancel = afterLoad(async () => {
      gl = await getGL(canvas);
      if (!gl || dead) { if (!dead) failRef.current?.(); return; }
      const g = gl;
      const prog = makeProgram(g, FULL_VS, frag);
      if (!(await whenLinked(g, prog))) { if (!dead) failRef.current?.(); return; }
      await nextIdle();
      if (dead) return;
      if (dead) return;
      const vao = fullscreen(g, prog);
      const locs = new Map<string, WebGLUniformLocation | null>();
      const loc = (n: string) => {
        if (!locs.has(n)) locs.set(n, g.getUniformLocation(prog, n));
        return locs.get(n)!;
      };
      let t = 0;
      const draw = (time?: number) => {
        if (g.isContextLost()) return;
        if (time !== undefined) t = time;
        fitCanvas(canvas, maxDpr, maxPixels);
        g.viewport(0, 0, canvas.width, canvas.height);
        g.useProgram(prog);
        g.uniform2f(loc('uRes'), canvas.width, canvas.height);
        g.uniform1f(loc('uTime'), t);
        for (const [k, v] of Object.entries(uni.current(t))) {
          const l = loc(k);
          if (typeof v === 'number') g.uniform1f(l, v);
          else if (v.length === 2) g.uniform2fv(l, v);
          else if (v.length === 3) g.uniform3fv(l, v);
          else if (v.length === 4) g.uniform4fv(l, v);
          else g.uniform1fv(l, v);
        }
        g.bindVertexArray(vao);
        g.drawArrays(g.TRIANGLES, 0, 3);
      };
      redraw.current = () => draw();
      draw(0);
      setReady(true);
      const onResize = () => draw();
      window.addEventListener('resize', onResize);
      const loop = prefersStill() ? () => {} : runLoop(draw, fps);
      stop = () => { loop(); window.removeEventListener('resize', onResize); };
    });

    const lost = (e: Event) => { e.preventDefault(); stop(); failRef.current?.(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => {
      dead = true;
      cancel();
      stop();
      redraw.current = () => {};
      canvas.removeEventListener('webglcontextlost', lost);
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, [frag, fps, maxDpr, maxPixels]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, opacity: ready ? 1 : 0, transition: 'opacity .9s ease' }}
    />
  );
}

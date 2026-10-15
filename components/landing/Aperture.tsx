"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import { LogoMark } from "@/components/brand/Logo";

export function Aperture({ progress }: { progress: MotionValue<number> }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    let disposed = false;
    let cleanup = () => {};
    void import("./aperture-scene").then(({ createApertureRig, WebGLRenderer, ACESFilmicToneMapping }) => {
      if (disposed) return;
      let renderer: InstanceType<typeof WebGLRenderer>;
      try { renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" }); }
      catch { return; }
      const rig = createApertureRig();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      renderer.setClearColor(0xfbfbfd, 0);
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.domElement.setAttribute("aria-hidden", "true");
      element.appendChild(renderer.domElement);
      let frame = 0, visible = true, lost = false, width = 0, height = 0, last = 0;
      const pointer = { x: 0, y: 0 }, target = { x: 0, y: 0 };
      const draw = (time: number) => {
        frame = 0;
        if (disposed || !visible || document.hidden || lost || !width || !height) return;
        const dt = Math.min((time - last) / 1000 || 1 / 60, .05); last = time;
        const mix = 1 - Math.exp(-10 * dt);
        pointer.x += (target.x - pointer.x) * mix;
        pointer.y += (target.y - pointer.y) * mix;
        rig.update(reduce.matches ? 0 : progress.get(), reduce.matches ? { x: 0, y: 0 } : pointer);
        renderer.render(rig.scene, rig.camera);
        element.dataset.ready = "true";
        if (!reduce.matches && Math.abs(pointer.x - target.x) + Math.abs(pointer.y - target.y) > .001) schedule();
      };
      const schedule = () => { if (!frame && !disposed && visible && !document.hidden && !lost) frame = requestAnimationFrame(draw); };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || reduce.matches) return;
        target.x = event.clientX / window.innerWidth - .5;
        target.y = event.clientY / window.innerHeight - .5;
        schedule();
      };
      const reset = () => { target.x = target.y = 0; schedule(); };
      const resize = new ResizeObserver(([entry]) => {
        width = entry.contentRect.width; height = entry.contentRect.height;
        if (!width || !height) return;
        renderer.setSize(width, height); rig.resize(width / height); schedule();
      }); resize.observe(element);
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { last = 0; schedule(); } }); observer.observe(element);
      const unsubscribe = progress.on("change", schedule);
      const contextLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; delete element.dataset.ready; };
      const contextRestored = () => { lost = false; schedule(); };
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("blur", reset);
      document.addEventListener("visibilitychange", schedule);
      reduce.addEventListener("change", schedule);
      cleanup = () => {
        cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); unsubscribe();
        window.removeEventListener("pointermove", move); window.removeEventListener("blur", reset);
        document.removeEventListener("visibilitychange", schedule); reduce.removeEventListener("change", schedule);
        renderer.domElement.removeEventListener("webglcontextlost", contextLost);
        renderer.domElement.removeEventListener("webglcontextrestored", contextRestored);
        rig.dispose(); renderer.dispose(); renderer.domElement.remove(); delete element.dataset.ready;
      };
    }).catch(() => { /* The brand still is the first paint and the WebGL fallback. */ });
    return () => { disposed = true; cleanup(); };
  }, [progress]);
  return <div ref={host} className="aperture-canvas" aria-hidden="true"><LogoMark className="aperture-still" /></div>;
}

"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

export function AgentMascot({ progress }: { progress: MotionValue<number> }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup = () => {};
    void import("./mascot-scene").then(({ createAgentRig, WebGLRenderer, ACESFilmicToneMapping }) => {
      if (disposed) return;
      let renderer: InstanceType<typeof WebGLRenderer>;
      try { renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default" }); }
      catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      renderer.setClearColor(0xf8f7f3, 0);
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.domElement.setAttribute("aria-hidden", "true");
      element.appendChild(renderer.domElement);
      const rig = createAgentRig();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      let frame = 0, visible = true, lost = false, width = 0, height = 0, last = 0, elapsed = 0;
      const pointer = { x: 0, y: 0 }, target = { x: 0, y: 0 };
      const move = (event: PointerEvent) => {
        target.x = event.clientX / window.innerWidth - .5;
        target.y = event.clientY / window.innerHeight - .5;
      };
      const reset = () => { target.x = target.y = 0; };
      const draw = (time: number) => {
        const dt = Math.min((time - last) / 1000 || 1 / 60, .04); last = time; elapsed += dt;
        const mix = 1 - Math.exp(-7 * dt);
        pointer.x += (target.x - pointer.x) * mix;
        pointer.y += (target.y - pointer.y) * mix;
        rig.update(reduce.matches ? .34 : progress.get(), reduce.matches ? 0 : elapsed, reduce.matches ? { x: 0, y: 0 } : pointer);
        renderer.render(rig.scene, rig.camera);
        element.dataset.ready = "true";
        if (!disposed && visible && !document.hidden && !reduce.matches && !lost) frame = requestAnimationFrame(draw);
      };
      const restart = () => {
        cancelAnimationFrame(frame); last = 0;
        if (!disposed && visible && !document.hidden && !lost && width && height) frame = requestAnimationFrame(draw);
      };
      const resize = new ResizeObserver(([entry]) => {
        width = entry.contentRect.width; height = entry.contentRect.height;
        if (!width || !height) return;
        renderer.setSize(width, height);
        rig.resize(width / height);
        restart();
      });
      resize.observe(element);
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; restart(); }); observer.observe(element);
      const contextLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); delete element.dataset.ready; };
      const contextRestored = () => { lost = false; restart(); };
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
      document.addEventListener("visibilitychange", restart);
      reduce.addEventListener("change", restart);
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("blur", reset);
      cleanup = () => {
        cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
        renderer.domElement.removeEventListener("webglcontextlost", contextLost);
        renderer.domElement.removeEventListener("webglcontextrestored", contextRestored);
        document.removeEventListener("visibilitychange", restart);
        reduce.removeEventListener("change", restart);
        window.removeEventListener("pointermove", move); window.removeEventListener("blur", reset);
        rig.dispose(); renderer.dispose(); renderer.domElement.remove(); delete element.dataset.ready;
      };
    }).catch(() => { /* The still illustration remains visible if WebGL is unavailable. */ });
    return () => { disposed = true; cleanup(); };
  }, [progress]);
  return <div ref={host} className="agent-scene" role="img" aria-label="A small agent carries a payment, pauses for approval, sends it after approval, then holds up a verified audit record.">
    <svg className="agent-fallback" viewBox="0 0 400 440" aria-hidden>
      <ellipse cx="200" cy="402" rx="110" ry="13" fill="#202923" opacity=".07" />
      <rect x="151" y="290" width="34" height="99" rx="17" fill="#3458d4" /><rect x="215" y="290" width="34" height="99" rx="17" fill="#3458d4" />
      <rect x="126" y="221" width="150" height="118" rx="49" fill="#3458d4" />
      <rect x="95" y="74" width="210" height="174" rx="65" fill="#eeeee6" stroke="#c5cdc4" />
      <rect x="119" y="117" width="162" height="79" rx="32" fill="#20372d" />
      <rect x="158" y="142" width="14" height="31" rx="7" fill="#f0643f" /><rect x="228" y="142" width="14" height="31" rx="7" fill="#f0643f" />
      <path d="M126 263L95 301M276 263L304 285" stroke="#3458d4" strokeWidth="26" strokeLinecap="round" />
      <circle cx="311" cy="274" r="39" fill="#ee7048" /><text x="311" y="288" textAnchor="middle" fontSize="45" fontWeight="700" fill="#f8f7f3">$</text>
    </svg>
  </div>;
}

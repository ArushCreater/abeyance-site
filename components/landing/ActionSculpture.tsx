"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import type { Mesh, MeshPhysicalMaterial } from "three";

/** Scroll opens a real WebGL threshold, releases the action and builds its ledger. */
export function ActionSculpture({ progress }: { progress: MotionValue<number> }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup = () => {};
    void Promise.all([import("three"), import("three/addons/geometries/RoundedBoxGeometry.js")]).then(([T, { RoundedBoxGeometry }]) => {
      if (disposed) return;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" }); } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0); renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.35;
      renderer.domElement.setAttribute("aria-hidden", "true"); element.appendChild(renderer.domElement); element.dataset.ready = "true";
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(34, 1, 0.1, 80); camera.position.set(7.3, 5.2, 10.6); camera.lookAt(0, 0, 0);
      scene.add(new T.HemisphereLight(0xe6e5ed, 0x30231a, 3.2));
      const key = new T.DirectionalLight(0xfff4e4, 7); key.position.set(3, 6, 4); scene.add(key);
      const rim = new T.DirectionalLight(0xc3d3ed, 5); rim.position.set(-5, 3, -3); scene.add(rim);
      const amberLight = new T.PointLight(0xeba43f, 24, 12); amberLight.position.set(0, 1, 2); scene.add(amberLight);
      // Studio reflections generated locally; no downloaded textures or models.
      const room = new T.Scene(); room.background = new T.Color(0x292929);
      for (const [x, y, z, sx, sy, sz, color] of [[0, 5, 0, 9, 0.1, 6, 0xffffff], [-5, 1, 0, 0.1, 4, 7, 0x8a9eae], [4, 0, 3, 0.1, 6, 4, 0xc1a281]]) {
        const light = new T.Mesh(new T.BoxGeometry(sx, sy, sz), new T.MeshBasicMaterial({ color })); light.position.set(x, y, z); room.add(light);
      }
      const pmrem = new T.PMREMGenerator(renderer); const environment = pmrem.fromScene(room); scene.environment = environment.texture; pmrem.dispose();
      const body = new T.Group(); scene.add(body);
      const steel = new T.MeshPhysicalMaterial({ color: 0x999b9b, metalness: 1, roughness: 0.25, clearcoat: 0.5 });
      const dark = new T.MeshPhysicalMaterial({ color: 0x242528, metalness: 0.85, roughness: 0.3 });
      const amber = new T.MeshPhysicalMaterial({ color: 0xe7a54b, metalness: 0.6, roughness: 0.2, emissive: 0xb36311, emissiveIntensity: 0.16, clearcoat: 1 });
      const pale = new T.MeshPhysicalMaterial({ color: 0xd6d2ca, metalness: 0.65, roughness: 0.23 });
      const box = (w: number, h: number, d: number, material: MeshPhysicalMaterial, radius = 0.07) => new T.Mesh(new RoundedBoxGeometry(w, h, d, 4, radius), material);
      const gates: InstanceType<typeof T.Group>[] = [];
      for (let i = 0; i < 3; i++) {
        const gate = new T.Group(); const material = i === 1 ? steel : dark;
        const top = box(3.6, 0.3, 0.38, material); top.position.y = 1.7;
        const bottom = box(3.6, 0.3, 0.38, material); bottom.position.y = -1.7;
        const left = box(0.3, 3.2, 0.38, material); left.position.x = -1.65;
        const right = box(0.3, 3.2, 0.38, material); right.position.x = 1.65;
        gate.add(top, bottom, left, right); gate.position.z = (i - 1) * 0.8; body.add(gate); gates.push(gate);
      }
      const inlays = new T.Group();
      for (const x of [-1.47, 1.47]) { const line = box(0.025, 2.7, 0.05, amber, 0.008); line.position.set(x, 0, 0.24); inlays.add(line); } body.add(inlays);
      const packet = new T.Group(); packet.add(box(2.25, 1.45, 0.2, amber, 0.1));
      const inset = box(1.98, 1.18, 0.012, dark, 0.055); inset.position.z = 0.111; packet.add(inset);
      for (let i = 0; i < 3; i++) { const line = box(i === 0 ? 0.8 : 1.4, 0.045, 0.017, i === 0 ? amber : pale, 0.012); line.position.set(i === 0 ? -0.3 : 0, 0.28 - i * 0.24, 0.13); packet.add(line); } body.add(packet);
      const ledger: Mesh[] = [];
      for (let i = 0; i < 5; i++) { const tile = box(2.25, 1.45, 0.16, i === 4 ? amber : steel, 0.08); body.add(tile); ledger.push(tile); }
      const pedestal = box(5.8, 0.16, 4.2, dark, 0.07); pedestal.position.y = -2.12; body.add(pedestal);
      const grooves = new T.GridHelper(5.6, 14, 0x454440, 0x252525); grooves.position.y = -2.025; body.add(grooves);
      let width = 1, height = 1, raf = 0, visible = true;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)"); const pointer = { x: 0, y: 0 };
      const move = (e: PointerEvent) => { const r = element.getBoundingClientRect(); pointer.x = (e.clientX - r.left) / r.width - 0.5; pointer.y = (e.clientY - r.top) / r.height - 0.5; };
      const smooth = (a: number, b: number, v: number) => { const t = T.MathUtils.clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
      const draw = (time: number) => {
        const p = reduce.matches ? 0.32 : progress.get(); const open = smooth(0.36, 0.62, p); const record = smooth(0.69, 0.98, p);
        body.rotation.set(-0.08 + (reduce.matches ? 0 : pointer.y * 0.035), -0.38 + open * 0.55 + (reduce.matches ? 0 : pointer.x * 0.08), -0.09 + record * 0.08);
        body.position.y = 0.35 + (reduce.matches ? 0 : Math.sin(time / 2300) * 0.045);
        gates.forEach((gate, i) => { gate.position.x = (i - 1) * open * 1.1; gate.position.z = (i - 1) * (0.8 + open * 0.5); gate.rotation.y = (i - 1) * open * 0.18; gate.scale.setScalar(1 - record * 0.35); gate.position.y = record * 1.6; });
        packet.position.set(open * 1.4 - record * 1.4, (reduce.matches ? 0 : Math.sin(time / 1600) * 0.07) - record * 1.2, 2.2 - smooth(0, 0.29, p) * 1.9 - open * 2.7);
        packet.rotation.set(-record * Math.PI / 2, open * 0.3, 0); packet.scale.setScalar(1 - record * 0.4); packet.visible = record < 0.96;
        inlays.visible = record < 0.3; amber.emissiveIntensity = 0.12 + (p > 0.2 && p < 0.5 ? 0.14 : 0.02);
        ledger.forEach((tile, i) => { tile.visible = record > 0.04; tile.position.set(0, -1.5 + i * 0.23 * record, (1 - record) * (i - 2) * 0.7); tile.rotation.set(-Math.PI / 2, 0, -0.08 * (1 - record) * i); tile.scale.setScalar(0.6 + record * 0.4); });
        camera.aspect = width / height; camera.position.z = width < 480 ? 13.8 : 11.2; camera.updateProjectionMatrix(); renderer.render(scene, camera);
        if (visible && !disposed && !reduce.matches && !document.hidden) raf = requestAnimationFrame(draw);
      };
      const resize = new ResizeObserver(([entry]) => { width = entry.contentRect.width; height = entry.contentRect.height; if (width && height) { renderer.setSize(width, height); if (reduce.matches) draw(0); } }); resize.observe(element);
      const restart = () => { cancelAnimationFrame(raf); if (visible && !document.hidden) { if (reduce.matches) draw(0); else raf = requestAnimationFrame(draw); } };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; restart(); }); observer.observe(element);
      document.addEventListener("visibilitychange", restart); reduce.addEventListener("change", restart); window.addEventListener("pointermove", move, { passive: true });
      cleanup = () => {
        cancelAnimationFrame(raf); resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", restart); reduce.removeEventListener("change", restart); window.removeEventListener("pointermove", move);
        const geometries = new Set<InstanceType<typeof T.BufferGeometry>>(); const materials = new Set<InstanceType<typeof T.Material>>();
        for (const s of [scene, room]) s.traverse((o) => { if (o instanceof T.Mesh) { geometries.add(o.geometry); for (const m of Array.isArray(o.material) ? o.material : [o.material]) materials.add(m); } });
        geometries.forEach((g) => g.dispose()); materials.forEach((m) => m.dispose()); grooves.geometry.dispose(); (grooves.material as InstanceType<typeof T.Material>).dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => { /* The full text and HTML receipt work without WebGL. */ });
    return () => { disposed = true; cleanup(); };
  }, [progress]);
  return <div ref={host} className="action-sculpture" role="img" aria-label="A payment moves through a metal policy threshold, pauses for approval, then becomes a linked audit record."><div className="sculpture-fallback" aria-hidden><span /><span /><span /></div></div>;
}

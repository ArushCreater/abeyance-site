"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import { WORDMARK_GLYPHS } from "@/lib/brand";

/** A continuous, printed paper trail. Geometry folds, travels and opens as one object. */
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
      try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0xf8f7f3, 0);
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.domElement.setAttribute("aria-hidden", "true");
      element.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(34, 1, .1, 80);
      scene.add(new T.HemisphereLight(0xffffff, 0xb8b6a8, 2.8));
      const key = new T.DirectionalLight(0xfffaf0, 4.2); key.position.set(-4, 7, 8); key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -10; key.shadow.camera.right = 10; key.shadow.camera.top = 10; key.shadow.camera.bottom = -10; key.shadow.bias = -.001; key.shadow.normalBias = .04; scene.add(key);
      const fill = new T.DirectionalLight(0xbfcfff, 1.8); fill.position.set(5, 0, -5); scene.add(fill);
      const world = new T.Group(); scene.add(world);

      // Print a receipt directly onto the deformable paper, including real transparent feed holes.
      const sheet = document.createElement("canvas"); sheet.width = 768; sheet.height = 3072;
      const ctx = sheet.getContext("2d")!;
      ctx.fillStyle = "#fdfbf2"; ctx.fillRect(0, 0, 768, 3072);
      const ink = "#202923", blue = "#3458d4", orange = "#dc512c";
      const text = (value: string, x: number, y: number, size: number, color = ink, weight = 500) => { ctx.fillStyle = color; ctx.font = `${weight} ${size}px Arial, sans-serif`; ctx.fillText(value, x, y); };
      for (let i = 0; i < 4; i++) {
        const y = i * 768;
        ctx.strokeStyle = "#b7bcb1"; ctx.lineWidth = 2; ctx.setLineDash([9, 10]); ctx.beginPath(); ctx.moveTo(53, y + 745); ctx.lineTo(715, y + 745); ctx.stroke(); ctx.setLineDash([]);
        ctx.save(); ctx.translate(92, y + 34); ctx.scale(.73, .73); ctx.fillStyle = ink;
        for (const [x, d] of WORDMARK_GLYPHS) { ctx.save(); ctx.translate(x, 0); ctx.fill(new Path2D(d), "evenodd"); ctx.restore(); }
        ctx.restore(); text(`0${i + 1} / ACTION 000042`, 92, y + 149, 23, "#6b7369");
        ctx.fillStyle = blue; ctx.fillRect(92, y + 187, 584, 4);
      }
      text("$600.00", 87, 355, 132, ink, 800); text("send_payment", 92, 421, 34, ink, 700);
      text("AGENT     accounts-payable", 92, 515, 24); text("PAYEE     vendor_42", 92, 564, 24); text("PROPOSED  awaiting policy", 92, 651, 24, blue);
      text("Your rules.", 88, 1080, 84, ink, 800); text("amount > $500", 92, 1155, 38);
      ctx.fillStyle = orange; ctx.fillRect(92, 1206, 584, 100); text("II   HOLD FOR A HUMAN", 119, 1271, 34, "#fffaf0", 800);
      text("JEV / SHADOW", 92, 1388, 27, blue, 700); text("0.78 risk / new payee", 92, 1438, 25);
      text("Approved.", 87, 1850, 92, blue, 800); text("BY A PERSON, IN SLACK", 92, 1920, 26);
      text("DECISION  approve", 92, 2040, 26); text("ACTION    resumed", 92, 2090, 26); text("YOUR CALL. THEN GO.", 92, 2190, 29, blue, 700);
      text("On record.", 88, 2620, 84, ink, 800); text("POLICY v1 / ED25519", 92, 2700, 28, blue, 700);
      text("previous_hash", 92, 2810, 27); text("9f3c... → a84e...", 92, 2860, 29); text("TAMPER-EVIDENT / VERIFIED", 92, 2974, 25, blue, 700);
      ctx.globalCompositeOperation = "destination-out";
      for (let y = 28; y < 3072; y += 54) for (const x of [24, 744]) { ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalCompositeOperation = "source-over";
      const print = new T.CanvasTexture(sheet); print.colorSpace = T.SRGBColorSpace; print.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      const paper = new T.MeshStandardMaterial({ map: print, roughness: .65, metalness: 0, side: T.DoubleSide, alphaTest: .5 });
      const reverse = new T.MeshStandardMaterial({ map: print, color: 0x3458d4, roughness: .52, side: T.BackSide, alphaTest: .5 });
      const geometry = new T.PlaneGeometry(2.8, 8.8, 12, 180);
      const ribbon = new T.Mesh(geometry, paper); ribbon.castShadow = true; ribbon.receiveShadow = true; ribbon.frustumCulled = false; world.add(ribbon);
      // A blue reverse face sits a paper thickness behind the printed surface.
      const backGeometry = geometry.clone(); const back = new T.Mesh(backGeometry, reverse); back.castShadow = true; back.frustumCulled = false; world.add(back);
      paper.side = T.FrontSide;
      const orangeMaterial = new T.MeshPhysicalMaterial({ color: 0xf0643f, roughness: .3, metalness: .08, clearcoat: .6 });
      const clamp = new T.Group();
      for (const x of [-.43, .43]) { const bar = new T.Mesh(new RoundedBoxGeometry(.48, 2.3, .42, 5, .16), orangeMaterial); bar.position.x = x; bar.castShadow = true; clamp.add(bar); }
      world.add(clamp);
      const sealCanvas = document.createElement("canvas"); sealCanvas.width = sealCanvas.height = 256;
      const sealCtx = sealCanvas.getContext("2d")!; sealCtx.fillStyle = "#3458d4"; sealCtx.fillRect(0, 0, 256, 256); sealCtx.strokeStyle = "#fdfbf2"; sealCtx.lineWidth = 16; sealCtx.lineCap = "round"; sealCtx.lineJoin = "round"; sealCtx.beginPath(); sealCtx.moveTo(66, 127); sealCtx.lineTo(110, 168); sealCtx.lineTo(191, 84); sealCtx.stroke();
      const sealTexture = new T.CanvasTexture(sealCanvas); sealTexture.colorSpace = T.SRGBColorSpace;
      const seal = new T.Group();
      const coin = new T.Mesh(new T.CylinderGeometry(.8, .8, .14, 64), new T.MeshStandardMaterial({ color: 0x3458d4, roughness: .35 })); coin.rotation.x = Math.PI / 2; coin.castShadow = true; seal.add(coin);
      const check = new T.Mesh(new T.CircleGeometry(.79, 64), new T.MeshBasicMaterial({ map: sealTexture })); check.position.z = .076; seal.add(check); world.add(seal);
      const floor = new T.Mesh(new T.PlaneGeometry(100, 100), new T.ShadowMaterial({ opacity: .10 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -5; floor.receiveShadow = true; scene.add(floor);
      const positions = geometry.attributes.position;
      const backPositions = backGeometry.attributes.position;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      let width = 1, height = 1, frame = 0, visible = true, lost = false, last = 0, current = progress.get();
      const pointer = { x: 0, y: 0 }, easedPointer = { x: 0, y: 0 };
      const move = (event: PointerEvent) => { pointer.x = event.clientX / window.innerWidth - .5; pointer.y = event.clientY / window.innerHeight - .5; };
      const resetPointer = () => { pointer.x = 0; pointer.y = 0; };
      const smooth = (a: number, b: number, x: number) => T.MathUtils.smoothstep(x, a, b);
      const interpolate = (values: number[], p: number) => { const f = T.MathUtils.clamp(p, 0, 1) * 3; const i = Math.min(2, Math.floor(f)); return T.MathUtils.lerp(values[i], values[i + 1], smooth(0, 1, f - i)); };
      const draw = (time: number) => {
        const dt = Math.min((time - last) / 1000 || 1 / 60, .05); last = time;
        current = reduce.matches ? .04 : T.MathUtils.damp(current, progress.get(), 7, dt);
        easedPointer.x = T.MathUtils.damp(easedPointer.x, pointer.x, 4, dt); easedPointer.y = T.MathUtils.damp(easedPointer.y, pointer.y, 4, dt);
        const p = current, t = reduce.matches ? 0 : time / 1000;
        const fold = smooth(.12, .30, p) * (1 - smooth(.37, .55, p));
        const archive = smooth(.73, .98, p);
        // Each row follows a centreline, with a changing twist around its tangent.
        // Unlike rigid cards, the whole strip continuously bends between these poses.
        for (let row = 0; row <= 180; row++) {
          const u = row / 180; const a = (u - .5) * Math.PI * 1.6;
          const x = Math.sin(a + t * .28) * (1.15 * (1 - fold) + .35 * fold) * (1 - archive * .7);
          const y = (.5 - u) * (8.8 - fold * 5.0 - archive * 4.3);
          const z = Math.cos(a + t * .23) * 1.1 * (1 - archive) + Math.sin(u * Math.PI * 6) * (fold * .75 + archive * 1.1);
          const twist = Math.sin(u * Math.PI * 2 + t * .28) * (.45 - fold * .20) * (1 - archive) + archive * Math.cos(u * Math.PI * 6) * .12;
          for (let col = 0; col <= 12; col++) {
            const w = (col / 12 - .5) * 2.8;
            const i = row * 13 + col;
            const xx = x + w * Math.cos(twist), zz = z + w * Math.sin(twist);
            positions.setXYZ(i, xx, y + Math.sin(col / 12 * Math.PI) * .045, zz);
            backPositions.setXYZ(i, xx, y + Math.sin(col / 12 * Math.PI) * .045, zz - .018);
          }
        }
        positions.needsUpdate = true; backPositions.needsUpdate = true; geometry.computeVertexNormals(); backGeometry.computeVertexNormals();
        const mobile = window.innerWidth <= 960 || window.innerWidth / window.innerHeight < 1.2;
        world.position.set(mobile ? 0 : interpolate([3.7, -3.3, 3.4, -3.2], p), mobile ? 0 : -.05, 0);
        world.rotation.set(interpolate([-.12, .16, -.12, .28], p) + (reduce.matches ? 0 : easedPointer.y * .12), interpolate([-.48, .38, -.5, .4], p) + (reduce.matches ? 0 : easedPointer.x * .24), interpolate([-.30, .20, -.25, .15], p) + Math.sin(t * .37) * .035);
        world.scale.setScalar(mobile ? interpolate([.87, 1.45, .90, 1.45], p) : interpolate([.92, 1.22, .94, 1.22], p));
        const hold = smooth(.11, .24, p) * (1 - smooth(.39, .52, p));
        clamp.visible = hold > .01; clamp.scale.setScalar(Math.max(.001, hold));
        clamp.position.set(1.5 * (1 - hold), .05, 2.0 - hold * .6); clamp.rotation.set(0, (1 - hold) * -.8, -.12 + (1 - hold) * .7);
        const approval = smooth(.48, .58, p); seal.visible = approval > .01; seal.scale.setScalar(Math.max(.001, approval));
        seal.position.set(1.10, -.65 + (1 - approval) * 3.5, 1.7); seal.rotation.set(.05, -.15, -.18 + Math.sin(t * .6) * .025);
        camera.position.set(mobile ? 0 : Math.sin(p * Math.PI * 2) * .55, mobile ? .2 : .45 + Math.sin(p * Math.PI) * .55, mobile ? 15.8 : 15.2 - Math.sin(p * Math.PI) * .8); camera.lookAt(0, 0, 0);
        renderer.render(scene, camera); element.dataset.ready = "true";
        if (visible && !disposed && !reduce.matches && !document.hidden) frame = requestAnimationFrame(draw);
      };
      const restart = () => { cancelAnimationFrame(frame); last = 0; if (visible && !lost && !document.hidden && width > 1 && height > 1) { if (reduce.matches) draw(0); else frame = requestAnimationFrame(draw); } };
      const resize = new ResizeObserver(([entry]) => { width = entry.contentRect.width; height = entry.contentRect.height; if (width && height) { renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); restart(); } }); resize.observe(element);
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; restart(); }); observer.observe(element);
      document.addEventListener("visibilitychange", restart); reduce.addEventListener("change", restart); window.addEventListener("pointermove", move, { passive: true }); window.addEventListener("blur", resetPointer);
      const contextLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); delete element.dataset.ready; };
      const contextRestored = () => { lost = false; restart(); };
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
      cleanup = () => {
        cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", restart); reduce.removeEventListener("change", restart); window.removeEventListener("pointermove", move); window.removeEventListener("blur", resetPointer); renderer.domElement.removeEventListener("webglcontextlost", contextLost); renderer.domElement.removeEventListener("webglcontextrestored", contextRestored);
        const geometries = new Set<InstanceType<typeof T.BufferGeometry>>(), materials = new Set<InstanceType<typeof T.Material>>();
        scene.traverse((object) => { if (object instanceof T.Mesh) { geometries.add(object.geometry); for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material); } });
        geometries.forEach((g) => g.dispose()); materials.forEach((m) => m.dispose()); print.dispose(); sealTexture.dispose(); key.shadow.dispose(); renderer.dispose(); renderer.domElement.remove(); delete element.dataset.ready;
      };
    }).catch(() => { /* The HTML receipt remains available without WebGL. */ });
    return () => { disposed = true; cleanup(); };
  }, [progress]);
  return <div ref={host} className="paper-trail-scene" role="img" aria-label="A printed payment ribbon flies across the scene, folds into an orange pause, opens with an approval seal, and becomes a continuous audit trail."><div className="paper-fallback" aria-hidden><b>ABEYANCE</b><span>ACTION / 000042</span><strong>$600.00</strong><p>send_payment</p><i>Ⅱ HOLD FOR APPROVAL</i><small>YOUR RULES. YOUR CALL.</small></div></div>;
}

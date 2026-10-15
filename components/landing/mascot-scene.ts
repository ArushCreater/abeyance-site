import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { smooth } from "../../lib/hero-motion.mjs";

export { WebGLRenderer, ACESFilmicToneMapping } from "three";

/** Geometry is built once. A frame only moves the character's joints and props. */
export function createAgentRig() {
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(33, 1, .1, 50);
  camera.position.set(2.7, 1.8, 10.8);
  camera.lookAt(.25, .45, 0);
  scene.add(new T.HemisphereLight(0xffffff, 0xc8c9b9, 2.5));
  const key = new T.DirectionalLight(0xfff6e5, 3.3);
  key.position.set(-3, 6, 6); scene.add(key);
  const fill = new T.DirectionalLight(0xc3d1ff, 2.1);
  fill.position.set(4, 2, -4); scene.add(fill);

  const ceramic = new T.MeshStandardMaterial({ color: 0xf1f0e5, roughness: .33, metalness: .05 });
  const blue = new T.MeshStandardMaterial({ color: 0x3458d4, roughness: .35, metalness: .12 });
  const visorMaterial = new T.MeshStandardMaterial({ color: 0x172c24, roughness: .24, metalness: .05 });
  const orange = new T.MeshStandardMaterial({ color: 0xf0643f, roughness: .3, metalness: .2 });
  const eyesMaterial = new T.MeshBasicMaterial({ color: 0xe6f5dc });
  const statusMaterial = new T.MeshBasicMaterial({ color: 0xf0643f });
  const ink = new T.MeshStandardMaterial({ color: 0x27443a, roughness: .4 });
  const green = new T.MeshStandardMaterial({ color: 0x26745b, roughness: .3 });
  const root = new T.Group(); root.name = "agent"; scene.add(root);
  const rounded = (w: number, h: number, d: number, radius: number, material: T.Material) => new T.Mesh(new RoundedBoxGeometry(w, h, d, 3, radius), material);
  const capsule = (radius: number, length: number, material: T.Material) => new T.Mesh(new T.CapsuleGeometry(radius, length, 4, 12), material);
  const panel = (w: number, h: number, r: number, material: T.Material) => {
    const x = -w / 2, y = -h / 2, s = new T.Shape();
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return new T.Mesh(new T.ExtrudeGeometry(s, { depth: .045, bevelEnabled: true, bevelSize: .025, bevelThickness: .025, bevelSegments: 2, curveSegments: 10, steps: 1 }), material);
  };
  const curve = (points: number[][], radius: number, material: T.Material) => new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(([x, y, z]) => new T.Vector3(x, y, z))), 24, radius, 6, false), material);

  const body = rounded(1.26, 1.32, .88, .3, blue); body.name = "body"; root.add(body);
  const backpack = rounded(.94, 1.02, .4, .16, ceramic); backpack.position.set(0, .03, -.52); root.add(backpack);
  const neck = new T.Mesh(new T.CylinderGeometry(.22, .25, .21, 20), ceramic); neck.position.y = .72; root.add(neck);
  const chest = panel(.61, .48, .14, ceramic); chest.position.set(0, -.02, .45); root.add(chest);
  for (const x of [-.08, .08]) { const bar = capsule(.025, .14, orange); bar.position.set(x, 0, .53); root.add(bar); }

  const head = new T.Group(); head.name = "head"; head.position.y = 1.38; root.add(head);
  head.add(rounded(2.06, 1.55, 1.44, .43, ceramic));
  const visor = panel(1.64, .75, .28, visorMaterial); visor.position.set(0, .02, .70); head.add(visor);
  const eyes = [-.35, .35].map((x) => {
    const eye = capsule(.065, .16, eyesMaterial); eye.position.set(x, .06, .80); head.add(eye); return eye;
  });
  const smile = curve([[-.13, -.16, .80], [0, -.20, .81], [.13, -.16, .80]], .018, eyesMaterial); head.add(smile);
  for (const side of [-1, 1]) {
    const ear = new T.Mesh(new T.CylinderGeometry(.23, .23, .16, 24), blue);
    ear.rotation.z = Math.PI / 2; ear.position.set(side * 1.05, -.02, 0); head.add(ear);
  }
  const antenna = capsule(.026, .28, ink); antenna.position.set(-.58, .91, -.10); head.add(antenna);
  const light = new T.Mesh(new T.SphereGeometry(.105, 16, 12), statusMaterial); light.position.set(-.58, 1.13, -.10); head.add(light);

  const arm = (side: number) => {
    const shoulder = new T.Group(); shoulder.position.set(side * .68, .40, 0); root.add(shoulder);
    const upper = capsule(.13, .42, blue); upper.position.y = -.30; shoulder.add(upper);
    const elbow = new T.Group(); elbow.position.y = -.62; shoulder.add(elbow);
    const joint = new T.Mesh(new T.SphereGeometry(.145, 12, 10), orange); elbow.add(joint);
    const forearm = capsule(.12, .36, blue); forearm.position.y = -.27; elbow.add(forearm);
    const hand = new T.Group(); hand.position.y = -.57; elbow.add(hand);
    const palm = new T.Mesh(new T.SphereGeometry(.21, 16, 12), ceramic); palm.scale.set(.85, 1.05, .67); hand.add(palm);
    const thumb = new T.Mesh(new T.SphereGeometry(.085, 12, 8), ceramic); thumb.position.set(-side * .16, .015, .035); hand.add(thumb);
    return { shoulder, elbow, hand };
  };
  const left = arm(-1), right = arm(1);
  left.hand.name = "left-hand"; right.hand.name = "right-hand";
  const legs = [-1, 1].map((side) => {
    const leg = new T.Group(); leg.position.set(side * .34, -.59, 0); root.add(leg);
    const shin = capsule(.16, .42, blue); shin.position.y = -.33; leg.add(shin);
    const boot = rounded(.50, .28, .77, .12, ceramic); boot.position.set(0, -.77, .16); leg.add(boot);
    const sole = rounded(.50, .09, .77, .04, blue); sole.position.set(0, -.90, .16); leg.add(sole);
    return leg;
  });

  const payment = new T.Group(); payment.name = "payment"; root.add(payment);
  const coin = new T.Mesh(new T.CylinderGeometry(.64, .64, .18, 48), orange); coin.rotation.x = Math.PI / 2; payment.add(coin);
  const coinFace = new T.Mesh(new T.CircleGeometry(.54, 48), ceramic); coinFace.position.z = .095; payment.add(coinFace);
  const dollar = curve([[.18, .22, .13], [.01, .30, .13], [-.19, .19, .13], [-.13, .04, .13], [.13, -.03, .13], [.18, -.18, .13], [0, -.28, .13], [-.19, -.20, .13]], .045, orange);
  const stroke = capsule(.025, .66, orange); stroke.position.z = .14; payment.add(dollar, stroke);

  const proof = new T.Group(); proof.name = "proof"; root.add(proof);
  const proofBase = new T.Mesh(new T.CylinderGeometry(.54, .54, .12, 48), green); proofBase.rotation.x = Math.PI / 2; proof.add(proofBase);
  const proofFace = new T.Mesh(new T.CircleGeometry(.46, 48), ceramic); proofFace.position.z = .067; proof.add(proofFace);
  proof.add(curve([[-.23, .01, .095], [-.07, -.15, .095], [.25, .19, .095]], .045, green));
  // Layered, faint contact shadow: no shadow-map pass or per-frame geometry updates.
  for (let i = 0; i < 4; i++) {
    const shadow = new T.Mesh(new T.CircleGeometry(1, 48), new T.MeshBasicMaterial({ color: 0x20372d, transparent: true, opacity: .013, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, -1.55 + i * .001, .12); shadow.scale.set(1.65 - i * .2, .74 - i * .08, 1); scene.add(shadow);
  }
  const restingEye = new T.Color(0xe6f5dc), heldEye = new T.Color(0xf2a05d), approvedEye = new T.Color(0xb9eccb);
  const heldLight = new T.Color(0xf0643f), approvedLight = new T.Color(0x26745b);
  function update(progress: number, time: number, pointer: { x: number; y: number }) {
    const p = T.MathUtils.clamp(Number.isFinite(progress) ? progress : 0, 0, 1);
    const hold = smooth(.14, .28, p) * (1 - smooth(.43, .56, p));
    const launch = smooth(.54, .76, p), recorded = smooth(.78, .93, p), approved = smooth(.47, .55, p);
    const move = 1 - hold, bob = Math.sin(time * 1.7) * .035 * move;
    root.position.set(-.15 + Math.sin(launch * Math.PI) * .12, bob, 0);
    root.rotation.set(0, -.22 + launch * .35 - recorded * .12 + pointer.x * .10, -.035 + Math.sin(launch * Math.PI) * -.12);
    head.rotation.set(pointer.y * .10 + Math.sin(launch * Math.PI * 2) * .12, -.08 + pointer.x * .22 + hold * .18, Math.sin(time * .7) * .025 * move);
    eyesMaterial.color.copy(restingEye).lerp(heldEye, hold).lerp(approvedEye, approved);
    statusMaterial.color.copy(heldLight).lerp(approvedLight, approved);
    const blink = 1 - Math.pow(Math.max(0, Math.cos(time * 1.1)), 48) * .85 * move;
    eyes.forEach((eye) => { eye.scale.y = hold * 1.2 + (1 - hold) * blink; });
    smile.scale.y = 1 - hold * .85;
    right.shoulder.rotation.set(-.58 + launch * .30, 0, .83 + Math.sin(launch * Math.PI) * .42 - recorded * .55);
    right.elbow.rotation.set(-.12, 0, 1.0 - Math.sin(launch * Math.PI) * 1.05);
    right.hand.rotation.z = -.15;
    left.shoulder.rotation.set(-.40 - recorded * .10, 0, -.30 - hold * .50 - recorded * .43);
    left.elbow.rotation.set(-.10, 0, -.10 - hold * 1.25 - recorded * 1.0);
    left.hand.rotation.set(hold * .8, 0, -.2);
    legs.forEach((leg, i) => { leg.rotation.x = Math.sin(time * 1.7 + i * Math.PI) * .025 * move - Math.sin(launch * Math.PI) * (i ? .10 : -.14); });
    payment.position.set(1.57 + launch * 3.8, .38 + Math.sin(launch * Math.PI) * 1.7, .86 - launch * 3.2);
    payment.rotation.set(.08, -.12 + launch * 3, -.1 + launch * 2.5);
    payment.scale.setScalar(Math.max(.001, 1 - smooth(.72, 1, launch))); payment.visible = launch < .999;
    proof.scale.setScalar(Math.max(.001, recorded)); proof.visible = recorded > .001;
    proof.position.set(-1.28, .35, .86); proof.rotation.set(.04, -.12, -.15);
  }
  const dispose = () => {
    const geometries = new Set<T.BufferGeometry>(), materials = new Set<T.Material>();
    scene.traverse((object) => { if (object instanceof T.Mesh) { geometries.add(object.geometry); for (const m of Array.isArray(object.material) ? object.material : [object.material]) materials.add(m); } });
    geometries.forEach((g) => g.dispose()); materials.forEach((m) => m.dispose());
  };
  update(0, 1, { x: 0, y: 0 });
  return { scene, camera, update, dispose, resize: (aspect: number) => { camera.aspect = aspect; camera.updateProjectionMatrix(); } };
}

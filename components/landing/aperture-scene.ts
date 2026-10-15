import {
  Scene, Group, Shape, ExtrudeGeometry, Mesh, MeshStandardMaterial,
  SphereGeometry, TorusGeometry, AmbientLight, DirectionalLight,
  PerspectiveCamera, Vector3,
} from "three";
import { SYMBOL_PATHS } from "../../lib/symbol.ts";
import { smooth } from "../../lib/hero-motion.mjs";
export { WebGLRenderer, ACESFilmicToneMapping } from "three";

// A small native path reader keeps these exact brand outlines usable without DOMParser.
// The source paths use only absolute M/L/C/Z commands.
export function symbolShape(path: string) {
  const tokens = path.match(/[MLCZ]|-?\d*\.?\d+/g) ?? [];
  const shape = new Shape();
  let i = 0;
  const x = () => (Number(tokens[i++]) - 627) / 200;
  const y = () => (628 - Number(tokens[i++])) / 200;
  while (i < tokens.length) {
    const op = tokens[i++];
    if (op === "M") shape.moveTo(x(), y());
    else if (op === "L") shape.lineTo(x(), y());
    else if (op === "C") shape.bezierCurveTo(x(), y(), x(), y(), x(), y());
    else if (op === "Z") shape.closePath();
    else throw new Error(`Unsupported symbol command: ${op}`);
  }
  return shape;
}

export function createApertureRig() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, .1, 50);
  camera.position.set(0, .15, 12.8);
  camera.lookAt(0, 0, 0);
  scene.add(new AmbientLight(0xe8eeff, 2.2));
  const key = new DirectionalLight(0xffffff, 5.2); key.position.set(-4, 6, 7); scene.add(key);
  const rim = new DirectionalLight(0x92adff, 3.8); rim.position.set(5, 1, -3); scene.add(rim);
  const fill = new DirectionalLight(0xffffff, 2); fill.position.set(2, -4, 4); scene.add(fill);
  const sculpture = new Group(); sculpture.name = "aperture"; scene.add(sculpture);
  const material = new MeshStandardMaterial({ color: 0x3458d4, metalness: .38, roughness: .24 });
  const pieces = SYMBOL_PATHS.map((path, index) => {
    const geometry = new ExtrudeGeometry(symbolShape(path), {
      depth: .36, bevelEnabled: true, bevelSize: .035, bevelThickness: .045,
      bevelSegments: 3, curveSegments: 16, steps: 1,
    });
    geometry.translate(0, 0, -.18);
    const mesh = new Mesh(geometry, material);
    mesh.name = `ribbon-${index}`; sculpture.add(mesh); return mesh;
  });
  const action = new Group(); action.name = "action"; scene.add(action);
  const silver = new MeshStandardMaterial({ color: 0xeaf0fc, metalness: .7, roughness: .19 });
  action.add(new Mesh(new SphereGeometry(.3, 32, 24), silver));
  const orbit = new Mesh(new TorusGeometry(.313, .018, 8, 48), material);
  orbit.rotation.x = .9; orbit.rotation.y = .5; action.add(orbit);
  const directions = [new Vector3(-.9, .6, .15), new Vector3(-.15, -.9, .3), new Vector3(.9, .2, -.15)];
  function update(value: number, pointer = { x: 0, y: 0 }) {
    const p = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
    const open = smooth(.5, .71, p) * (1 - smooth(.8, 1, p));
    const arrive = smooth(0, .2, p);
    const release = smooth(.54, .82, p);
    // All poses are pure functions of scroll. Reverse scrolling retraces the same path.
    sculpture.rotation.set(-.12 + pointer.y * .1, -.28 + release * .18 + pointer.x * .16, -.08 + open * .04);
    pieces.forEach((piece, i) => {
      piece.position.copy(directions[i]).multiplyScalar(open * .95);
      piece.rotation.set(open * (i === 1 ? -.18 : .13), open * (i - 1) * .28, open * (i === 2 ? -.16 : .1));
    });
    action.position.set(-2.4 * (1 - arrive) + release * 2.7, -.1 + .1 * Math.sin(release * Math.PI), 1.2 * (1 - arrive) + .55 - release * 3.1);
    action.scale.setScalar((.7 + arrive * .3) * (1 - smooth(.82, .94, p)));
    action.rotation.set(arrive * .4 + release * .6, arrive * .5 + release * 2, 0);
  }
  update(0);
  return {
    scene, camera, update,
    resize(aspect: number) { camera.aspect = aspect; camera.position.z = aspect < .9 ? 14.8 : 12.8; camera.updateProjectionMatrix(); },
    dispose() {
      const geometries = new Set<ExtrudeGeometry | SphereGeometry | TorusGeometry>();
      scene.traverse(object => { if (object instanceof Mesh) geometries.add(object.geometry); });
      geometries.forEach(geometry => geometry.dispose()); material.dispose(); silver.dispose();
    },
  };
}

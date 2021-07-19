import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  OrthographicCamera
} from 'three';
import './main.css';

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'three-js-stage');
document.body.appendChild(canvas);

const dimension = {
  height: window.innerHeight,
  width: window.innerWidth
};

const mesh = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshBasicMaterial({
    color: 0xff0000
  })
);

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);

// const aspectRation = dimension.width / dimension.height;
// const camera = new OrthographicCamera(-1 * aspectRation, 1 * aspectRation, 1, -1, 0.1, 100);
camera.position.set(0, 0, 4);
camera.lookAt(mesh.position);

const axesHelper = new AxesHelper(1000);

const scene = new Scene();

scene.add(mesh);
scene.add(camera);
scene.add(axesHelper);

const renderer = new WebGLRenderer({
  canvas
});
renderer.setSize(dimension.width, dimension.height);

// Canvas Dimension and control cache
const rect = canvas.getBoundingClientRect();

const dimensionCache = {
  height: rect.height,
  width: rect.width
};

const controlCache = {
  p: 0,
  q: 0
};

// Adding custom controls
canvas.addEventListener('mousemove', function (event: MouseEvent) {
  const x = event.offsetX;
  const y = event.offsetY;

  controlCache.p = x / dimensionCache.width - 0.5;
  controlCache.q = y / dimensionCache.height - 0.5;

  // camera.position.setX(controlCache.p * 10);
  // camera.position.setY(controlCache.q * -10);

  camera.position.setX(2 * Math.sin(controlCache.p * 10 * Math.PI * 0.2));
  camera.position.setZ(2 * Math.cos(controlCache.p * 10 * Math.PI * 0.2));
  camera.position.setY(controlCache.q * -10);
});

// initial render
renderer.render(scene, camera);

let rafId: number;
let time = performance.now();

function gameLoop(timestamp: number): void {
  const dTime = timestamp - time;
  time = timestamp;
  const standardizingFactor = dTime * 0.00001;

  // mesh.rotation.set(0, Math.PI * 2 * timestamp * standardizingFactor, 0);
  camera.lookAt(mesh.position);
  renderer.render(scene, camera);

  rafId = requestAnimationFrame(gameLoop);
}

rafId = requestAnimationFrame(gameLoop);

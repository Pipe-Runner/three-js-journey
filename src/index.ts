import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BufferGeometry,
  BufferAttribute
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './main.css';

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'three-js-stage');
document.body.appendChild(canvas);

const dimension = {
  height: window.innerHeight,
  width: window.innerWidth
};

// const geometry = new BoxGeometry(1, 1, 1, 2, 2, 2);

const geometry = new BufferGeometry();
// Item size is three as there are 3 co-ordinates per vertex
geometry.setAttribute(
  'position',
  new BufferAttribute(new Float32Array([0, 0, 0, 3, 3, 3, 3, -3, 3]), 3)
);

const mesh = new Mesh(
  geometry,
  new MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
  })
);

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.lookAt(mesh.position);

camera.position.set(0, 0, 4);

const axesHelper = new AxesHelper(1000);

const scene = new Scene();

scene.add(mesh);
scene.add(camera);
scene.add(axesHelper);

const renderer = new WebGLRenderer({
  canvas
});
renderer.setSize(dimension.width, dimension.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener('resize', function () {
  console.log('resize');

  dimension.height = window.innerHeight;
  dimension.width = window.innerWidth;

  // update camera aspect ratio based on new dimensions
  camera.aspect = dimension.width / dimension.height;

  // this statement is needed for ThreeJS to know that the project matrix needs to be updated
  camera.updateProjectionMatrix();

  renderer.setSize(dimension.width, dimension.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', function () {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Adding built-in controls
const control = new OrbitControls(camera, canvas);
control.target.x = mesh.position.x;
control.target.y = mesh.position.y;
control.target.z = mesh.position.z;

// initial render
control.update();
renderer.render(scene, camera);

let rafId: number;
let time = performance.now();

function gameLoop(timestamp: number): void {
  const dTime = timestamp - time;
  time = timestamp;
  const standardizingFactor = dTime * 0.00001;

  control.update();
  renderer.render(scene, camera);

  rafId = requestAnimationFrame(gameLoop);
}

rafId = requestAnimationFrame(gameLoop);

import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import './main.css';

const gui = new GUI();

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
camera.position.set(0, 0, 3);

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

const control = new OrbitControls(camera, canvas);
control.target.x = mesh.position.x;
control.target.y = mesh.position.y;
control.target.z = mesh.position.z;

window.addEventListener('resize', function () {
  dimension.height = window.innerHeight;
  dimension.width = window.innerWidth;

  camera.aspect = dimension.width / dimension.height;
  camera.updateProjectionMatrix();

  renderer.setSize(dimension.width, dimension.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const cubeFolder = gui.addFolder('Red Cube');
cubeFolder.add(mesh.position, 'x').name('position-x').min(-10).max(10).step(0.001);
cubeFolder.add(mesh.position, 'y').name('position-y').min(-10).max(10).step(0.001);
cubeFolder.add(mesh.position, 'z').name('position-z').min(-10).max(10).step(0.001);
cubeFolder
  .add(mesh.rotation, 'x')
  .name('rotation-x')
  .min(-2 * Math.PI)
  .max(2 * Math.PI)
  .step(0.001);
cubeFolder
  .add(mesh.rotation, 'y')
  .name('rotation-y')
  .min(-2 * Math.PI)
  .max(2 * Math.PI)
  .step(0.001);
cubeFolder
  .add(mesh.rotation, 'z')
  .name('rotation-z')
  .min(-2 * Math.PI)
  .max(2 * Math.PI)
  .step(0.001);

let currentTimestamp = performance.now();
let rafId: number;

function gameLoop(timestamp) {
  control.update();
  renderer.render(scene, camera);
  rafId = requestAnimationFrame(gameLoop);
}

rafId = requestAnimationFrame(gameLoop);

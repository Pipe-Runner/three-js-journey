import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector3,
  MeshStandardMaterial,
  BoxBufferGeometry,
  SphereBufferGeometry,
  TorusBufferGeometry,
  AmbientLight,
  PointLight,
  DirectionalLight,
  PlaneBufferGeometry,
  HemisphereLight,
  RectAreaLight,
  SpotLight,
  HemisphereLightHelper
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

const ambientLight = new AmbientLight(0xffffff, 0.5);
const directionalLight = new DirectionalLight(0x00fffc, 0.5);
directionalLight.position.set(4, 4, 0);

const hemisphereLight = new HemisphereLight(0xff0000, 0x0000ff, 0.3);
const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 0.3);

const pointLight = new PointLight(0xff9000, 0.5);

const rectAreaLight = new RectAreaLight(0x4e00ff, 5, 1, 1);

const spotLight = new SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
spotLight.target.position.setX(-0.75);

const material = new MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.7,
  metalness: 0.3
});

const cubeMesh = new Mesh(new BoxBufferGeometry(1, 1, 1), material);
const sphereMesh = new Mesh(new SphereBufferGeometry(0.8, 12, 12), material);
sphereMesh.position.setX(-1.8);
const torusMesh = new Mesh(new TorusBufferGeometry(0.5, 0.3, 12, 24), material);
torusMesh.position.setX(1.8);
const planeMesh = new Mesh(new PlaneBufferGeometry(6, 4), material);
planeMesh.position.setY(-1);
planeMesh.rotateX(-Math.PI / 2);

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.position.set(0, 0, 3);

const axesHelper = new AxesHelper(1000);

const scene = new Scene();

scene.add(cubeMesh, sphereMesh, torusMesh, planeMesh);
scene.add(hemisphereLightHelper);
scene.add(ambientLight, directionalLight, hemisphereLight, pointLight, rectAreaLight, spotLight, spotLight.target);
scene.add(camera);
scene.add(axesHelper);

const renderer = new WebGLRenderer({
  canvas
});
renderer.setSize(dimension.width, dimension.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const control = new OrbitControls(camera, canvas);
control.target = new Vector3();

window.addEventListener('resize', function () {
  dimension.height = window.innerHeight;
  dimension.width = window.innerWidth;

  camera.aspect = dimension.width / dimension.height;
  camera.updateProjectionMatrix();

  renderer.setSize(dimension.width, dimension.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// const cubeFolder = gui.addFolder('Red Cube');
// cubeFolder.add(mesh.position, 'x').name('position-x').min(-10).max(10).step(0.001);
// cubeFolder.add(mesh.position, 'y').name('position-y').min(-10).max(10).step(0.001);
// cubeFolder.add(mesh.position, 'z').name('position-z').min(-10).max(10).step(0.001);
// cubeFolder
//   .add(mesh.rotation, 'x')
//   .name('rotation-x')
//   .min(-2 * Math.PI)
//   .max(2 * Math.PI)
//   .step(0.001);
// cubeFolder
//   .add(mesh.rotation, 'y')
//   .name('rotation-y')
//   .min(-2 * Math.PI)
//   .max(2 * Math.PI)
//   .step(0.001);
// cubeFolder
//   .add(mesh.rotation, 'z')
//   .name('rotation-z')
//   .min(-2 * Math.PI)
//   .max(2 * Math.PI)
//   .step(0.001);

let currentTimestamp = performance.now();
let rafId: number;

function gameLoop(timestamp) {
  control.update();
  renderer.render(scene, camera);
  rafId = requestAnimationFrame(gameLoop);
}

rafId = requestAnimationFrame(gameLoop);

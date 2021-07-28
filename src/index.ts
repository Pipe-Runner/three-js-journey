import {
  SphereBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MeshStandardMaterial,
  PlaneBufferGeometry,
  AmbientLight,
  DirectionalLight,
  Vector3,
  CameraHelper,
  PCFSoftShadowMap,
  SpotLight,
  PointLight
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import './main.css';

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'three-js-stage');
document.body.appendChild(canvas);

const dimension = {
  height: window.innerHeight,
  width: window.innerWidth
};

const gui = new GUI();
const scene = new Scene();

const ambientLight = new AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 0.3);
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 4;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.radius = 10;
// scene.add(new CameraHelper(directionalLight.shadow.camera));

const spotLight = new SpotLight(0xffffff, 0.7, 20, Math.PI / 0.3, 0.2, 2);
spotLight.position.setY(3);
spotLight.position.setZ(3);
spotLight.target.position.set(0, 0, 0);
spotLight.castShadow = true;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.far = 8;
scene.add(spotLight);
// scene.add(new CameraHelper(spotLight.shadow.camera));

const pointLight = new PointLight(0xffffff, 0.3);
pointLight.position.set(4, 4, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.camera.far = 14;
scene.add(pointLight);
// scene.add(new CameraHelper(pointLight.shadow.camera));


const material = new MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.7
  // wireframe: true
});

const sphereMesh = new Mesh(new SphereBufferGeometry(1, 24, 24), material);
scene.add(sphereMesh);
sphereMesh.castShadow = true;
sphereMesh.receiveShadow = false; // nothing on top

const planeMesh = new Mesh(new PlaneBufferGeometry(12, 12), material);
scene.add(planeMesh);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.position.setY(-1.3);
planeMesh.castShadow = false;
planeMesh.receiveShadow = true;

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
scene.add(camera);
camera.position.set(1, 1, 3);

// scene.add(new AxesHelper(1000));

const renderer = new WebGLRenderer({
  canvas
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
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

gui.add(ambientLight, 'intensity').name('ambient light intensity').min(0).max(1).step(0.0001);
const directionalLightFolder = gui.addFolder('Directional Light');
directionalLightFolder
  .add(directionalLight, 'intensity')
  .name('directional light intensity')
  .min(0)
  .max(1)
  .step(0.0001);
directionalLightFolder
  .add(directionalLight.position, 'x')
  .name('light-x')
  .min(-10)
  .max(10)
  .step(0.001);
directionalLightFolder
  .add(directionalLight.position, 'y')
  .name('light-y')
  .min(-10)
  .max(10)
  .step(0.001);
directionalLightFolder
  .add(directionalLight.position, 'z')
  .name('light-z')
  .min(-10)
  .max(10)
  .step(0.001);

let currentTimestamp = performance.now();
let rafId: number;

function gameLoop(timestamp) {
  control.update();
  renderer.render(scene, camera);
  rafId = requestAnimationFrame(gameLoop);
}

rafId = requestAnimationFrame(gameLoop);

import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  PlaneBufferGeometry,
  TorusBufferGeometry,
  SphereBufferGeometry,
  LoadingManager,
  TextureLoader,
  DoubleSide,
  FrontSide,
  MeshNormalMaterial,
  MeshMatcapMaterial,
  MeshDepthMaterial,
  AmbientLight,
  PointLight,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshToonMaterial,
  NearestFilter,
  MeshStandardMaterial,
  BufferAttribute,
  Vector2
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

const loadingManager = new LoadingManager(
  () => {
    console.log('Loaded texture...');
  },
  () => {
    console.log('Loading texture...');
  },
  () => {
    console.error('Error while loading texture...');
  }
);

const textureLoader = new TextureLoader(loadingManager);

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');

const matcapTexture = textureLoader.load('/textures/matcaps/1.png');

const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');
gradientTexture.magFilter = NearestFilter;
gradientTexture.generateMipmaps = false;

const ambientLight = new AmbientLight(0xffffff, 0.5);
const pointLight = new PointLight(0xffffff, 0.5);
pointLight.position.set(3, 3, 3);

// Mesh basic material
// const material = new MeshBasicMaterial({
//   map: doorColorTexture,
//   color: 0xff00ff,
//   wireframe: false,
//   // opacity: 0.5,
//   transparent: true,
//   alphaMap: doorAlphaTexture,
//   side: FrontSide
// });

// const material = new MeshNormalMaterial({
//   flatShading: true
// });

// const material = new MeshMatcapMaterial({
//   matcap: matcapTexture
// });

// const material = new MeshDepthMaterial();

// const material = new MeshLambertMaterial();

// const material = new MeshPhongMaterial({
//   shininess: 1000,
//   specular: 0xff00ff
// });

// const material = new MeshToonMaterial({
//   gradientMap: gradientTexture
// });

const material = new MeshStandardMaterial({
  // metalness: 0.45,
  // roughness: 0.65,
  aoMap: doorAmbientOcclusionTexture,
  map: doorColorTexture,
  aoMapIntensity: 1,
  displacementMap: doorHeightTexture,
  displacementScale: 0.04,
  metalnessMap: doorMetalnessTexture,
  roughnessMap: doorRoughnessTexture,
  normalMap: doorNormalTexture,
  normalScale: new Vector2(0.3, 0.3),
  alphaMap: doorAlphaTexture,
  transparent: true
});

gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);

const plane = new Mesh(new PlaneBufferGeometry(1, 1, 64, 64), material);

// For AO Map
plane.geometry.setAttribute('uv2', new BufferAttribute(plane.geometry.attributes.uv.array, 2));

const sphere = new Mesh(new SphereBufferGeometry(0.5, 64, 64), material);
sphere.position.setX(-2);

// For AO Map
sphere.geometry.setAttribute('uv2', new BufferAttribute(sphere.geometry.attributes.uv.array, 2));

const torus = new Mesh(new TorusBufferGeometry(0.5, 0.1, 64, 32, 2 * Math.PI), material);
torus.position.setX(2);

// For AO Map
torus.geometry.setAttribute('uv2', new BufferAttribute(torus.geometry.attributes.uv.array, 2));

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.position.set(0, 0, 3);

const axesHelper = new AxesHelper(1000);

const scene = new Scene();

scene.add(plane, sphere, torus);
scene.add(pointLight, ambientLight, camera, axesHelper);

const renderer = new WebGLRenderer({
  canvas
});
renderer.setSize(dimension.width, dimension.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const control = new OrbitControls(camera, canvas);
control.target.x = 0;
control.target.y = 0;
control.target.z = 0;

window.addEventListener('resize', function () {
  dimension.height = window.innerHeight;
  dimension.width = window.innerWidth;

  camera.aspect = dimension.width / dimension.height;
  camera.updateProjectionMatrix();

  renderer.setSize(dimension.width, dimension.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const planeFolder = gui.addFolder('Plane');
planeFolder.add(plane.position, 'x').name('position-x').min(-10).max(10).step(0.001);
planeFolder.add(plane.position, 'y').name('position-y').min(-10).max(10).step(0.001);
planeFolder.add(plane.position, 'z').name('position-z').min(-10).max(10).step(0.001);
planeFolder
  .add(plane.rotation, 'x')
  .name('rotation-x')
  .min(-2 * Math.PI)
  .max(2 * Math.PI)
  .step(0.001);
planeFolder
  .add(plane.rotation, 'y')
  .name('rotation-y')
  .min(-2 * Math.PI)
  .max(2 * Math.PI)
  .step(0.001);
planeFolder
  .add(plane.rotation, 'z')
  .name('rotation-z')
  .min(-2 * Math.PI)
  .max(2 * Math.PI)
  .step(0.001);

const sphereFolder = gui.addFolder('Sphere');
sphereFolder.add(sphere.position, 'x').name('position-x').min(-10).max(10).step(0.001);
sphereFolder.add(sphere.position, 'y').name('position-y').min(-10).max(10).step(0.001);
sphereFolder.add(sphere.position, 'z').name('position-z').min(-10).max(10).step(0.001);
sphereFolder
  .add(sphere.rotation, 'x')
  .name('rotation-x')
  .min(-2 * Math.PI)
  .max(2 * Math.PI)
  .step(0.001);
sphereFolder
  .add(sphere.rotation, 'y')
  .name('rotation-y')
  .min(-2 * Math.PI)
  .max(2 * Math.PI)
  .step(0.001);
sphereFolder
  .add(sphere.rotation, 'z')
  .name('rotation-z')
  .min(-2 * Math.PI)
  .max(2 * Math.PI)
  .step(0.001);

const torusFolder = gui.addFolder('Torus');
torusFolder.add(torus.position, 'x').name('position-x').min(-10).max(10).step(0.001);
torusFolder.add(torus.position, 'y').name('position-y').min(-10).max(10).step(0.001);
torusFolder.add(torus.position, 'z').name('position-z').min(-10).max(10).step(0.001);
torusFolder
  .add(torus.rotation, 'x')
  .name('rotation-x')
  .min(-2 * Math.PI)
  .max(2 * Math.PI)
  .step(0.001);
torusFolder
  .add(torus.rotation, 'y')
  .name('rotation-y')
  .min(-2 * Math.PI)
  .max(2 * Math.PI)
  .step(0.001);
torusFolder
  .add(torus.rotation, 'z')
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

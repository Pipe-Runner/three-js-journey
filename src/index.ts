import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector3,
  SphereBufferGeometry,
  PointsMaterial,
  Points,
  BufferGeometry,
  BufferAttribute,
  TextureLoader,
  AdditiveBlending
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import './main.css';

const gui = new GUI();

const textureLoader = new TextureLoader();

const texture = textureLoader.load('/textures/particles/2.png');

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'three-js-stage');
document.body.appendChild(canvas);

const dimension = {
  height: window.innerHeight,
  width: window.innerWidth
};

// const pointGeometry = new SphereBufferGeometry(1, 32, 32); // This geometry surface will be used to fill the points

const count = 5000; // number of points
const position = new Float32Array(count * 3);
const color = new Float32Array(count * 3);

for(let i = 0; i < (count * 3); i++){
  position[i] = (Math.random() - 0.5) * 10;
  color[i] = Math.random();
}

const pointGeometry = new BufferGeometry();
pointGeometry.setAttribute('position', new BufferAttribute(position, 3))
pointGeometry.setAttribute('color', new BufferAttribute(color, 3));

const pointMaterial = new PointsMaterial({
  // color: 0xff00ff,
  // map: texture,
  alphaMap: texture,
  transparent: true
});
pointMaterial.sizeAttenuation = true;
pointMaterial.size = 0.1;
// pointMaterial.alphaTest = 0.01; //disabling this to try out depth test
// pointMaterial.depthTest = false; // disabling this to try out depth write
pointMaterial.depthWrite = false; // disabling this to try out blending
pointMaterial.blending = AdditiveBlending;
pointMaterial.vertexColors = true; // will be needed to use vertex color (still affected by main color)

const points = new Points(
  pointGeometry,
  pointMaterial
);

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.position.set(0, 0, 3);

const axesHelper = new AxesHelper(1000);

const scene = new Scene();

scene.add(points);
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
  for(let i = 0; i < count; i++){
    const x = pointGeometry.attributes.position.getX(i);
    pointGeometry.attributes.position.setY(i, Math.sin((timestamp * 0.001) + x));
  }

  pointGeometry.attributes.position.needsUpdate = true;

  control.update();
  renderer.render(scene, camera);
  rafId = requestAnimationFrame(gameLoop);
}

rafId = requestAnimationFrame(gameLoop);

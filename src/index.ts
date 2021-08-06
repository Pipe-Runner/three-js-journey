import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector3,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  AdditiveBlending,
  Points,
  Color
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import './main.css';

const gui = new GUI();

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'three-js-stage');
document.body.appendChild(canvas);

const scene = new Scene();

const dimension = {
  height: window.innerHeight,
  width: window.innerWidth
};

/**
 * Galaxy generator
 */
const parameters = {
  count: 100000,
  size: 0.01,
  radius: 7.5,
  branches: 8,
  spin: 1,
  randomness: 0.5,
  randomnessPower: 4,
  insideColor: '#ff6030',
  outsideColor: '#1b3984'
}

let geometry: BufferGeometry = null;
let material: PointsMaterial = null;
let mesh: Points = null;

const generateGalaxy = () => {
  if( mesh !== null ){
    geometry.dispose();
    material.dispose();
    scene.remove(mesh);
  }

  /**
   * Point geometry
   */
  geometry = new BufferGeometry();
  const position = new Float32Array(parameters.count * 3);
  const color = new Float32Array(parameters.count * 3);

  const insideColor = new Color(parameters.insideColor);
  const outsideColor = new Color(parameters.outsideColor);

  for(let i = 0; i < parameters.count; i+=3){
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * parameters.randomness * (Math.random() > 0.5 ? -1 : 1);
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * parameters.randomness * (Math.random() > 0.5 ? -1 : 1);
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * parameters.randomness * (Math.random() > 0.5 ? -1 : 1);

    position[i] = (Math.sin(branchAngle + spinAngle) * radius) + randomX;
    position[i + 1] = randomY;
    position[i + 2] = (Math.cos(branchAngle + spinAngle) * radius) + randomZ;

    const mixedColor = insideColor.clone().lerp(outsideColor, radius / parameters.radius); // cloned in order to avoid original object modification 

    color[i] = mixedColor.r;
    color[i + 1] = mixedColor.g;
    color[i + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new BufferAttribute(position, 3));
  geometry.setAttribute('color', new BufferAttribute(color, 3))

  /**
   * Point material
   */
  material = new PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true
  });

  /**
   * Point mesh
   */
  mesh = new Points(geometry, material);
  scene.add(mesh);
}

generateGalaxy();

gui.add(parameters, 'count').min(10).max(100000).step(10).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.01).max(2).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(5).step(1).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.add(parameters, 'outsideColor').onFinishChange(generateGalaxy);


const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.position.set(6, 6, 6);

const axesHelper = new AxesHelper(1000);

scene.add(camera);
// scene.add(axesHelper);

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

let currentTimestamp = performance.now();
let rafId: number;

function gameLoop(timestamp) {
  control.update();
  renderer.render(scene, camera);
  rafId = requestAnimationFrame(gameLoop);
}

rafId = requestAnimationFrame(gameLoop);

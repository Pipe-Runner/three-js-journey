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
  PlaneBufferGeometry,
  AmbientLight,
  MeshStandardMaterial,
  DirectionalLight,
  CameraHelper,
  Clock
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import { Body, ContactMaterial, Material, Plane, Sphere, Vec3, World } from 'cannon';
import gsap from 'gsap';
import './main.css';

/**
 * CANNON
 */

const world = new World();

/**
 * Material
 */
const concreteMaterial = new Material('concrete');
const plasticMaterial = new Material('plastic');

/**
 * Contact Material
 */
const concreteVsPlasticMaterial = new ContactMaterial(concreteMaterial, plasticMaterial, {
  friction: 0.1,
  restitution: 0.7
});
world.addContactMaterial(concreteVsPlasticMaterial);

world.gravity.set(0, -9.82, 0);

/**
 * Bodies
 */

const planeShape = new Plane();
const planeBody = new Body({
  mass: 0,
  position: new Vec3(0, 0, 0),
  shape: planeShape,
  material: concreteMaterial
});
planeBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

/**
 * THREE JS
 */
const gui = new GUI();
const scene = new Scene();

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'three-js-stage');
document.body.appendChild(canvas);

const dimension = {
  height: window.innerHeight,
  width: window.innerWidth
};

const ambientLight = new AmbientLight('white', 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight('white', 0.5);
directionalLight.position.setX(2.5);
directionalLight.position.setY(9.5);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 12;
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;
scene.add(directionalLight);
// scene.add(new CameraHelper(directionalLight.shadow.camera));

const plane = new Mesh(
  new PlaneBufferGeometry(8, 8),
  new MeshStandardMaterial({
    // wireframe: true,
    color: 'white',
    metalness: 0.5,
    roughness: 0.8
  })
);
plane.receiveShadow = true;
plane.rotateX(-Math.PI / 2);
scene.add(plane);

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.position.set(3, 3, 3);

const axesHelper = new AxesHelper(1000);

// scene.add(mesh);
scene.add(camera);
scene.add(axesHelper);

const renderer = new WebGLRenderer({
  canvas
});
renderer.shadowMap.enabled = true;
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

const directionLightFolder = gui.addFolder('Directional Light');
directionLightFolder.add(directionalLight.position, 'x').min(0).max(100).step(0.5);
directionLightFolder.add(directionalLight.position, 'y').min(0).max(100).step(0.5);
directionLightFolder.add(directionalLight.position, 'z').min(0).max(100).step(0.5);

/**
 * Utils
 */
const updateObjectArray: { mesh: Mesh; object: Body }[] = [];

const generateSphere = (radius: number, position: { x: number; y: number; z: number }): void => {
  const sphereMesh = new Mesh(
    new SphereBufferGeometry(radius, 34, 34),
    new MeshStandardMaterial({
      metalness: 0.4,
      roughness: 0.3,
      color: 'grey'
    })
  );

  sphereMesh.castShadow = true;
  sphereMesh.position.copy(position as unknown as Vector3);
  scene.add(sphereMesh);

  const sphereShape = new Sphere(radius);
  const sphereBody = new Body({
    mass: 1,
    shape: sphereShape,
    material: plasticMaterial
  });
  sphereBody.position.copy(position as unknown as Vec3);
  world.addBody(sphereBody);

  updateObjectArray.push({
    mesh: sphereMesh,
    object: sphereBody
  });
};

generateSphere(0.5, { x: 0, y: 6, z: 0 });

let oldElapsedTime = 0;
const clock = new Clock();
let rafId: number;

function gameLoop() {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  control.update();
  renderer.render(scene, camera);

  world.step(1 / 60, deltaTime, 3);

  /**
   * Update sphere position
   */
  for (const item of updateObjectArray) {
    const { mesh, object } = item;
    mesh.position.copy(object.position as unknown as Vector3);
  }

  rafId = requestAnimationFrame(gameLoop);
}

gameLoop();

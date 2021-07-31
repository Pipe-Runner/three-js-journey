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
  PointLight,
  Group,
  BoxBufferGeometry,
  ConeBufferGeometry,
  Fog,
  TextureLoader,
  Float32BufferAttribute,
  RepeatWrapping
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import './main.css';

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'three-js-stage');
document.body.appendChild(canvas);

const textureLoader = new TextureLoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAOTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const bricksAOTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAOTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');

grassColorTexture.repeat.set(12, 12);
grassColorTexture.wrapS = RepeatWrapping;
grassColorTexture.wrapT = RepeatWrapping;

grassAOTexture.repeat.set(12, 12);
grassAOTexture.wrapS = RepeatWrapping;
grassAOTexture.wrapT = RepeatWrapping;

grassNormalTexture.repeat.set(12, 12);
grassNormalTexture.wrapS = RepeatWrapping;
grassNormalTexture.wrapT = RepeatWrapping;

grassRoughnessTexture.repeat.set(12, 12);
grassRoughnessTexture.wrapS = RepeatWrapping;
grassRoughnessTexture.wrapT = RepeatWrapping;

const dimension = {
  height: window.innerHeight,
  width: window.innerWidth
};

const gui = new GUI();
const scene = new Scene();

const ambientLight = new AmbientLight('#b9d5ff', 0.12);
scene.add(ambientLight);
gui.add(ambientLight, 'intensity').name('ambient light intensity').min(0).max(1).step(0.0001);

const directionalLight = new DirectionalLight('#b9d5ff', 0.12);
directionalLight.position.set(4, 5, -2);
scene.add(directionalLight);
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
// scene.add(new CameraHelper(directionalLight.shadow.camera));

const fog = new Fog('#262837', 1, 15);
scene.fog = fog;

// house group
const house = new Group();
scene.add(house);

// door light
const doorLight = new PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// Walls
const wallMesh = new Mesh(
  new BoxBufferGeometry(4, 2.5, 4),
  new MeshStandardMaterial({
    map: bricksColorTexture,
    normalMap: bricksNormalTexture,
    aoMap: bricksAOTexture,
    roughnessMap: bricksRoughnessTexture
  })
);
wallMesh.geometry.setAttribute(
  'uv2',
  new Float32BufferAttribute(wallMesh.geometry.attributes.uv.array, 2)
);
wallMesh.position.setY(2.5 / 2);
house.add(wallMesh);

// Roof
const roofMesh = new Mesh(
  new ConeBufferGeometry(3.5, 1, 4),
  new MeshStandardMaterial({
    color: '#b35f45'
  })
);
roofMesh.position.setY(2.5 + 1 / 2);
roofMesh.rotateY(Math.PI / 4);
house.add(roofMesh);

const floorMesh = new Mesh(
  new PlaneBufferGeometry(20, 20),
  new MeshStandardMaterial({
    map: grassColorTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
    aoMap: grassAOTexture
  })
);
floorMesh.geometry.setAttribute(
  'uv2',
  new Float32BufferAttribute(floorMesh.geometry.attributes.uv.array, 2)
);
floorMesh.rotation.x = -Math.PI * 0.5;
floorMesh.position.y = 0;
scene.add(floorMesh);

const doorMesh = new Mesh(
  new PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAOTexture,
    normalMap: doorNormalTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture
  })
);
doorMesh.geometry.setAttribute(
  'uv2',
  new Float32BufferAttribute(doorMesh.geometry.attributes.uv.array, 2)
);
doorMesh.position.setY(1);
doorMesh.position.setZ(2 + 0.0001);
scene.add(doorMesh);

// bush
const bushGeometry = new SphereBufferGeometry(1, 16, 16);
const bushMaterial = new MeshStandardMaterial({
  color: '#89c854'
});

// bush 1
const bushMesh1 = new Mesh(bushGeometry, bushMaterial);
bushMesh1.scale.set(0.5, 0.5, 0.5);
bushMesh1.position.set(0.8, 0.2, 2.2);

// bush 1
const bushMesh2 = new Mesh(bushGeometry, bushMaterial);
bushMesh2.scale.set(0.25, 0.25, 0.25);
bushMesh2.position.set(1.4, 0.1, 2.1);

// bush 1
const bushMesh3 = new Mesh(bushGeometry, bushMaterial);
bushMesh3.scale.set(0.4, 0.4, 0.4);
bushMesh3.position.set(-0.8, 0.1, 2.2);

// bush 1
const bushMesh4 = new Mesh(bushGeometry, bushMaterial);
bushMesh4.scale.set(0.15, 0.15, 0.15);
bushMesh4.position.set(-1, 0.05, 2.6);

scene.add(bushMesh1, bushMesh2, bushMesh3, bushMesh4);

// grave
const graves = new Group();

const graveGeometry = new BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new MeshStandardMaterial({
  color: '#b2b6b1'
});

const rInner = 3;
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const x = Math.sin(angle);
  const z = Math.cos(angle);

  const graveMesh = new Mesh(graveGeometry, graveMaterial);
  graveMesh.position.set((rInner + Math.random() * 7) * x, 0.4, (rInner + Math.random() * 7) * z);
  scene.add(graveMesh);
  graveMesh.castShadow = true;
}

// ghosts
const ghost1 = new PointLight('#ff00ff', 2, 3);
const ghost2 = new PointLight('#00ffff', 2, 3);
const ghost3 = new PointLight('#ffff00', 2, 3);
scene.add(ghost1, ghost2, ghost3);

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
scene.add(camera);
camera.position.set(1, 1, 3);

// scene.add(new AxesHelper(1000));

const renderer = new WebGLRenderer({
  canvas
});
renderer.setSize(dimension.width, dimension.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837');

//shadows
directionalLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
wallMesh.castShadow = true;
roofMesh.castShadow = true;
bushMesh1.castShadow = true;
bushMesh2.castShadow = true;
bushMesh3.castShadow = true;
bushMesh4.castShadow = true;
floorMesh.receiveShadow = true;
renderer.shadowMap.enabled = true;

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
  const angle = timestamp * 0.0001 * Math.PI * 2;

  ghost1.position.set(6 * Math.sin(angle), 0.5 + 2 * Math.sin(angle), 6 * Math.cos(angle));
  ghost2.position.set(
    4 * Math.sin(angle * 3),
    0.5 + 2 * Math.sin(angle),
    4 * Math.cos(angle * 3)
  );
  ghost3.position.set(
    8 * Math.sin(angle * 0.1),
    0.5 + 2 * Math.sin(angle),
    8 * Math.cos(angle * 0.1)
  );

  control.update();
  renderer.render(scene, camera);
  rafId = requestAnimationFrame(gameLoop);
}

rafId = requestAnimationFrame(gameLoop);

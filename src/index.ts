import {
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  Vector3,
  CubeTextureLoader,
  Mesh,
  MeshStandardMaterial,
  sRGBEncoding,
  CineonToneMapping,
  NoToneMapping,
  ReinhardToneMapping,
  LinearToneMapping,
  ACESFilmicToneMapping,
  PCFShadowMap,
  CameraHelper,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import './main.css';

const dimension = {
  height: window.innerHeight,
  width: window.innerWidth
};

/**
 * Getting canvas instance
 */
const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'three-js-stage');
document.body.appendChild(canvas);

const gui = new GUI();
const scene = new Scene();

const debugObject = {
  envMapIntensity: 1.3
}

gui.add(debugObject, 'envMapIntensity').min(0).max(20).step(0.01).onChange(() => {
  scene.traverse((child) => {
    if( child instanceof Mesh && child.material instanceof MeshStandardMaterial ){
      child.material.envMapIntensity = debugObject.envMapIntensity;
    }
  })
});

/**
 * object traversal function
 */
function updateEnvMapOnAll(envMap){
  scene.traverse((child) => {
    if( child instanceof Mesh && child.material instanceof MeshStandardMaterial ){
      child.receiveShadow = true;
      child.castShadow = true;
      child.material.envMap = envMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
    }
  })
}

/**
 * Model loader
 */
 const gltfLoader = new GLTFLoader();
 
 /**
  * Environment map loader
  */
 const cubeTextureLoader = new CubeTextureLoader();
 cubeTextureLoader.load(['/textures/environmentMaps/0/px.jpg','/textures/environmentMaps/0/nx.jpg','/textures/environmentMaps/0/py.jpg','/textures/environmentMaps/0/ny.jpg','/textures/environmentMaps/0/pz.jpg','/textures/environmentMaps/0/nz.jpg'], (environmentMap) => {
   environmentMap.encoding = sRGBEncoding;
   scene.background = environmentMap;

   gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (flightHelmetGltf) => {
    const helmetGroup = flightHelmetGltf.scene;
    helmetGroup.scale.set(3, 3, 3);
    scene.add(helmetGroup);

    //applying env map on all objects in the scene
    updateEnvMapOnAll(environmentMap);
  })
 })

/**
 * Adding lights to the scene (AL)
 */
const ambientLight = new AmbientLight('white', 0.25);
scene.add(ambientLight);

/**
 * Adding lights to the scene (DL)
 */
const directionalLight = new DirectionalLight('white', 2.7);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.shadow.camera.far = 4.3;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
scene.add(directionalLight);
// NOTE: Try shadow bias / shadow normal bias if you get shadow acne

const guiDirectionalLight = gui.addFolder('directional-light');
guiDirectionalLight.add(directionalLight.position, 'x').min(-10).max(10).step(0.01);
guiDirectionalLight.add(directionalLight.position, 'y').min(-10).max(10).step(0.01);
guiDirectionalLight.add(directionalLight.position, 'z').min(-10).max(10).step(0.01);
guiDirectionalLight.add(directionalLight, 'intensity').min(0).max(10).step(0.001);

const directionLightCameraHelper = new CameraHelper(directionalLight.shadow.camera);
scene.add(directionLightCameraHelper);

/**
 * Camera
 */
const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.position.set(3, 3, 3);
scene.add(camera);

/**
 * Axis helper
 */
const axesHelper = new AxesHelper(1000);
scene.add(axesHelper);

const renderer = new WebGLRenderer({
  canvas,
  antialias: true
});
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = sRGBEncoding;
renderer.toneMapping = CineonToneMapping;
renderer.toneMappingExposure = 2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;
renderer.setSize(dimension.width, dimension.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

gui.add(renderer, 'toneMapping', {
  "None" : NoToneMapping,
  "Cineon" : CineonToneMapping,
  "Reinhard": ReinhardToneMapping,
  "Linear": LinearToneMapping,
  "ACESFilmic": ACESFilmicToneMapping
}).onFinishChange(() => {
  renderer.toneMapping = Number(renderer.toneMapping);

  scene.traverse((child) => {
    if( child instanceof Mesh && child.material instanceof MeshStandardMaterial ){
      child.material.needsUpdate = true;
    }
  })
})

gui.add(renderer, 'toneMappingExposure').min(0).max(5).step(0.1);

/**
 * Orbit controls
 */
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

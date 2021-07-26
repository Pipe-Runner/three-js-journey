import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  FontLoader,
  TextBufferGeometry,
  Vector3,
  MeshMatcapMaterial,
  TextureLoader,
  TorusBufferGeometry
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
/** Importing fonts directly */
// import typefaceFronts from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import './main.css';

const gui = new GUI();

// Font loader
const fontLoader = new FontLoader();

// Texture loader
const textureLoader = new TextureLoader();

const matcapTexture = textureLoader.load('/matcap/sample.png');

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'three-js-stage');
document.body.appendChild(canvas);

const dimension = {
  height: window.innerHeight,
  width: window.innerWidth
};

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.position.set(0, 0, 3);

const axesHelper = new AxesHelper(1000);

const scene = new Scene();

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  console.log('Font loaded');
  const textGeometry = new TextBufferGeometry('Aakash Mallik', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 6, // keep it low
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4 // keep it low
  });

  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5, // bevel size needs to be subtracted
  //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5, // bevel size needs to be subtracted
  //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5 // bevel thickness needs to be subtracted
  // );

  textGeometry.center();

  const material = new MeshMatcapMaterial({
    matcap: matcapTexture
  });
  const textMesh = new Mesh(textGeometry, material);
  scene.add(textMesh);

  console.time('donut');

  const torusGeometry = new TorusBufferGeometry(0.3, 0.2, 20, 45);
  // const torusMaterial = new MeshMatcapMaterial({ matcap: matcapTexture }); // optimization

  for (let i = 0; i < 100; i++) {
    const mesh = new Mesh(torusGeometry, material);

    mesh.position.set(
      10 * (Math.random() - 0.5),
      10 * (Math.random() - 0.5),
      10 * (Math.random() - 0.5)
    );

    mesh.rotateX((Math.random() - 0.5) * Math.PI);
    mesh.rotateY((Math.random() - 0.5) * Math.PI);

    const scale = Math.random();
    mesh.scale.set(scale, scale, scale);

    scene.add(mesh);
  }

  console.timeEnd('donut');
});

scene.add(camera);
scene.add(axesHelper);

const renderer = new WebGLRenderer({
  canvas
});
renderer.setSize(dimension.width, dimension.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const control = new OrbitControls(camera, canvas);
control.target = new Vector3(0, 0, 0);

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

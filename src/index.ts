import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Texture,
  TextureLoader,
  LoadingManager,
  RepeatWrapping,
  MirroredRepeatWrapping,
  NearestFilter
} from 'three';
import './main.css';

const loadingManager = new LoadingManager(
  () => {
    console.log('loading finished');
  },
  () => {
    console.log('loading');
  },
  () => {
    console.log('onError');
  }
);

const textureLoader = new TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');

// Texture transformation
colorTexture.repeat.x = 2;
colorTexture.repeat.y = 3;
colorTexture.wrapS = MirroredRepeatWrapping;
colorTexture.wrapT = RepeatWrapping;
colorTexture.offset.x = 0.5;
colorTexture.rotation = 1;

colorTexture.minFilter = NearestFilter;

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
    // color: 0xff0000
    map: colorTexture
  })
);

console.log(mesh.geometry.attributes.uv);

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.position.set(1.5, 1.5, 1.5);
camera.lookAt(mesh.position);

const axesHelper = new AxesHelper(1000);

const scene = new Scene();

scene.add(mesh);
scene.add(camera);
scene.add(axesHelper);

const renderer = new WebGLRenderer({
  canvas
});
renderer.setSize(dimension.width, dimension.height);

renderer.render(scene, camera);

function gameLoop() {
  renderer.render(scene, camera);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

import {
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';
import './main.css';

const canvasElem = document.createElement('canvas');
canvasElem.setAttribute('id', 'three-js-stage');

document.body.appendChild(canvasElem);

const size = {
  height: window.innerHeight,
  width: window.innerWidth
};

// Scene
const scene = new Scene();

// Red Box
const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({
  color: 0xff0000
});
const mesh = new Mesh(geometry, material);
mesh.position.set(0.7, -0.6, 1);
mesh.scale.setX(2);

// Rotation
mesh.rotation.set(Math.PI / 4, Math.PI / 4, 0, 'YXZ');

// Adding object to scene
scene.add(mesh);

// Camera
const camera = new PerspectiveCamera(75, size.width / size.height);
// NOTE: This property editing could have been done after camera was added to the scene as well
camera.position.set(1, 1, 3);
camera.lookAt(new Vector3(0, 0, 0));
scene.add(camera);

// Axes helper
const axesHelper = new AxesHelper(100);
scene.add(axesHelper);

// Renderer
const renderer = new WebGLRenderer({
  canvas: canvasElem
});

renderer.setSize(size.width, size.height);

renderer.render(scene, camera);

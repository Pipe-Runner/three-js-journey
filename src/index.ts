import {
  AxesHelper,
  BoxGeometry,
  Group,
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

const geometry = new BoxGeometry(1, 1, 1);

// Red Box
const mesh1 = new Mesh(
  geometry,
  new MeshBasicMaterial({
    color: 0xff0000
  })
);
mesh1.position.set(0, 0, 0);

// Blue Box
const mesh2 = new Mesh(
  geometry,
  new MeshBasicMaterial({
    color: 0x00ff00
  })
);
mesh2.position.set(-2, 0, 0);

// Green Box
const mesh3 = new Mesh(
  geometry,
  new MeshBasicMaterial({
    color: 0x0000ff
  })
);
mesh3.position.set(2, 0, 0);

// Group
const group = new Group();
group.add(mesh1, mesh2, mesh3);

// Rotation of Group
group.rotation.set(Math.PI / 3, 0, Math.PI / 4);

// Adding object to scene
scene.add(group);

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

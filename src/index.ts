import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';
import './main.css';

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
    color: 0xff0000
  })
);

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.position.set(0, 0, 3);

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

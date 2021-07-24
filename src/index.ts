import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Texture
} from 'three';
import './main.css';

const image = new Image();
const texture = new Texture(image);

image.onload = () => {
  // ask ThreeJS to force update the texture
  texture.needsUpdate = true;
};

image.src = '/textures/door/color.jpg';

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
    map: texture
  })
);

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.position.set(1.5, 1.5, 1.5);
camera.lookAt(mesh.position)

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

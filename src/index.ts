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
  Raycaster,
  Vector2
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import './main.css';

const gui = new GUI();
const scene = new Scene();

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'three-js-stage');
document.body.appendChild(canvas);

const dimension = {
  height: window.innerHeight,
  width: window.innerWidth
};

const sphere1 = new Mesh(
  new SphereBufferGeometry(1, 32, 32),
  new MeshBasicMaterial({
    color: 0xff0000
  })
);
scene.add(sphere1);
sphere1.position.setX(-5);

const sphere2 = new Mesh(
  new SphereBufferGeometry(1, 32, 32),
  new MeshBasicMaterial({
    color: 0xff0000
  })
);
scene.add(sphere2);

const sphere3 = new Mesh(
  new SphereBufferGeometry(1, 32, 32),
  new MeshBasicMaterial({
    color: 0xff0000
  })
);
scene.add(sphere3);
sphere3.position.setX(5);

/**
 * Raycaster
 */

const raycaster = new Raycaster(new Vector3(-10, 0, 0), new Vector3(10, 0, 0).normalize());

// const intersect = raycaster.intersectObject(sphere1);
// const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);

// console.log(intersect, intersects);

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.position.set(0, 0, 6);

const axesHelper = new AxesHelper(1000);

scene.add(camera);
scene.add(axesHelper);

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

const mouse = new Vector2();
canvas.addEventListener('mousemove', (event: MouseEvent) => {
  const verticalPosition = (event.offsetY / dimension.height) * 2 - 1;
  const horizontalPosition = (event.offsetX / dimension.width) * 2 - 1;

  mouse.setX(horizontalPosition);
  mouse.setY(-verticalPosition);
});

let currentTimestamp = performance.now();
let rafId: number;

const objectList = [sphere3, sphere2, sphere1];

function gameLoop(timestamp) {
  sphere1.position.setY(3 * Math.sin((100 * sphere1.position.x + timestamp) * 0.001));
  sphere2.position.setY(3 * Math.sin(timestamp * 0.001));
  sphere3.position.setY(3 * Math.sin((100 * sphere3.position.x + timestamp) * 0.001));

  raycaster.setFromCamera(mouse, camera); // using raycaster from camera

  const intersectingArray = raycaster.intersectObjects(objectList);
  objectList.forEach((object) => object.material.color.set('#ff0000'));
  intersectingArray.forEach((intersectingItem) => {
    const object = intersectingItem.object as Mesh<SphereBufferGeometry, MeshBasicMaterial>;
    object.material.color.set('#ff00ff');
  });

  control.update();
  renderer.render(scene, camera);
  rafId = requestAnimationFrame(gameLoop);
}

rafId = requestAnimationFrame(gameLoop);

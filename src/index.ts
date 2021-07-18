import {
  BoxGeometry,
  Clock,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';
import gsap from 'gsap';
import './main.css';

const dimensions = {
  height: window.innerHeight,
  width: window.innerWidth
};
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.setAttribute('id', 'three-js-stage');

const scene = new Scene();

const mesh = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshBasicMaterial({
    color: 0xff0000
  })
);
scene.add(mesh);

const camera = new PerspectiveCamera(75, dimensions.width / dimensions.height);
scene.add(camera);
camera.position.set(0, 0, 3);

const renderer = new WebGLRenderer({
  canvas
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// FPS adaptation
// // initial render
// renderer.render(scene, camera);

// // this ID can be used to cancel RAF calls
// // (thus killing subsequent calls due to the recursive game loop call structure)
// let requestAnimationCallId: number;
// let time = performance.now();

// (function gameLoop(timestamp: number): void {
//   const dTime = timestamp - time;
//   time = timestamp;

//   mesh.position.x += 0.0001 * dTime;

//   // subsequent renders
//   renderer.render(scene, camera);

//   requestAnimationCallId = requestAnimationFrame(gameLoop);
// })(performance.now());

// FPS adaptation using clock object
// const clock = new Clock();

// (function gameLoop(): void {
//   const dTime = clock.getDelta();

//   // mesh.rotation.x += 0.0001 * dTime;

//   camera.position.x = 2 * Math.sin(clock.elapsedTime * Math.PI * 2 * 0.1);
//   camera.position.y = 2 * Math.cos(clock.elapsedTime * Math.PI * 2 * 0.1);
//   camera.lookAt(mesh.position);

//   // subsequent renders
//   renderer.render(scene, camera);

//   requestAnimationFrame(gameLoop);
// })();

// GSAP animation 
// (it is basically changing the properties of the object being passed)
// the render loop is just rendering the object
gsap.to(mesh.position, {
  x: 2,
  duration: 1,
  delay: 2
});
gsap.to(mesh.position, {
  x: mesh.position.x,
  duration: 1,
  delay: 4
});

(function gameLoop(): void {
  // subsequent renders
  renderer.render(scene, camera);

  requestAnimationFrame(gameLoop);
})();

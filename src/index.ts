import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  AxesHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector3,
  PlaneBufferGeometry,
  RawShaderMaterial,
  BufferAttribute,
  Vector2,
  Clock,
  TextureLoader
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
import gsap from 'gsap';
import './main.css';
import testVertexShader from './shaders/test/vertex.glsl';
import testFragmentShader from './shaders/test/fragment.glsl';

const textureLoader = new TextureLoader();
const flagTexture = textureLoader.load('/textures/flag-french.jpg');

const gui = new GUI();
const scene = new Scene();

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'three-js-stage');
document.body.appendChild(canvas);

const dimension = {
  height: window.innerHeight,
  width: window.innerWidth
};

const geometry = new PlaneBufferGeometry(1, 1, 32, 32);

/**
 * Adding a new custom attribute to consume in vertex shader
 */
const numElements = geometry.attributes.position.count;
const newAttribute = new Float32Array(numElements);

for (let i = 0; i < numElements; i++) {
  newAttribute[i] = Math.random();
}

geometry.setAttribute('newAttribute', new BufferAttribute(newAttribute, 1));

const material = new RawShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  uniforms: {
    newUniform: {
      value: new Vector2(20, 20) 
    },
    newUniformTime: {
      value: 0
    },
    newUniformTexture: {
      value: flagTexture
    }
  },
  wireframe: true
});

gui.add(material, 'wireframe');
gui.add(material.uniforms.newUniform.value, 'x').max(100).min(0).step(1).name('x Frequency');
gui.add(material.uniforms.newUniform.value, 'y').max(100).min(0).step(1).name('y Frequency');

const mesh = new Mesh(geometry, material);
scene.add(mesh);

const camera = new PerspectiveCamera(75, dimension.width / dimension.height);
camera.position.set(0, 0, 3);
scene.add(camera);

const axesHelper = new AxesHelper(1000);
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

const clock = new Clock();
let rafId: number;

function gameLoop(timestamp) {
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.newUniformTime.value = elapsedTime;

  control.update();
  renderer.render(scene, camera);
  rafId = requestAnimationFrame(gameLoop);
}

rafId = requestAnimationFrame(gameLoop);

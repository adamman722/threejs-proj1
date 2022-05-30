import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

renderer.render(scene, camera);

//this is where we actually create the said object we want to add
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});

const torus = new THREE.Mesh(geometry, material);
// const torus2 = new THREE.Mesh(geometry, material);

scene.add(torus);

// Need to add lighting to the object, so we can actually see it silly goose
const pointLight = new THREE.PointLight(0xffffff);

pointLight.position.set(5, 5, 5);

////ambient is like a flood light in the room
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// adding a light helper to show where the light source actually is
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

///able for us to move around the space
const controls = new OrbitControls(camera, renderer.domElement);

//adding random stars
function addStar() {
  const gemoetry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(gemoetry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
/// this is a handy function that creates us  whatever value we put as stars
Array(200).fill().forEach(addStar);

//now we add the background
const spaceTexture = new THREE.TextureLoader().load("./img/space.jpg");
scene.background = spaceTexture;

//making some texture things, still need to research this more
const moonTexture = new THREE.TextureLoader().load("./img/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("./img/normal.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);

moon.position.z = 20;
moon.position.setX(-14);
moon.position.setY(10);

// adding the abality to move the camera here using a function to move on scroll
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  // moon.rotation.x += 0.05;
  // moon.rotation.y += 0.075;
  // moon.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
//this is kinda like a useEffect it will always update for you, recursive function
function Animate() {
  requestAnimationFrame(Animate); // it calls itself here goose

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.y += 0.005;

  // torus2.rotation.x += -0.001;
  // torus2.rotation.y += -0.0005;
  // torus2.rotation.z += -0.001;

  controls.update();
  renderer.render(scene, camera);
}
Animate();

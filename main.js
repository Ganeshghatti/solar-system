import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const textureLoader = new THREE.TextureLoader();

const sunTexture = textureLoader.load("./img/sun.jpg");
const mercuryTexture = textureLoader.load("./img/mercury.jpg");
const venusTexture = textureLoader.load("./img/venus.jpg");
const earthTexture = textureLoader.load("./img/earth.jpg");
const marsTexture = textureLoader.load("./img/mars.jpg");
const jupiterTexture = textureLoader.load("./img/jupiter.jpg");
const saturnTexture = textureLoader.load("./img/saturn.jpg");
const saturnRingTexture = textureLoader.load("./img/saturn ring.png");
const uranusTexture = textureLoader.load("./img/uranus.jpg");
const uranusRingTexture = textureLoader.load("./img/uranus ring.png");
const neptuneTexture = textureLoader.load("./img/neptune.jpg");

var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
document.body.appendChild(renderer.domElement);
camera.position.set(-90, 140, 140);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 0;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// BACKGROUND
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
  "./img/stars.jpg",
  "./img/stars.jpg",
  "./img/stars.jpg",
  "./img/stars.jpg",
  "./img/stars.jpg",
  "./img/stars.jpg",
]);
scene.background = cubeTexture;

// AmbientLight
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//Point light
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

// SUN
const sungeo = new THREE.SphereGeometry(16, 30, 30);
const sunmat = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sungeo, sunmat);
scene.add(sun);

const createPlanete = (size, texture, position, ring) => {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);
  console.log(ring);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(obj);
  mesh.position.x = position;
  return { mesh, obj };
};

const mercury = createPlanete(3.2, mercuryTexture, 28);
const venus = createPlanete(5.8, venusTexture, 44);
const earth = createPlanete(6, earthTexture, 62);
const mars = createPlanete(4, marsTexture, 78);
const jupiter = createPlanete(12, jupiterTexture, 100);
const saturn = createPlanete(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const uranus = createPlanete(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture,
});
const neptune = createPlanete(7, neptuneTexture, 200);

var render = function () {
  requestAnimationFrame(render);
  controls.update();

  //Self-rotation
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);

  //Around-sun-rotation
  mercury.obj.rotateY(0.04);
  venus.obj.rotateY(0.015);
  earth.obj.rotateY(0.01);
  mars.obj.rotateY(0.008);
  jupiter.obj.rotateY(0.002);
  saturn.obj.rotateY(0.0009);
  uranus.obj.rotateY(0.0004);
  neptune.obj.rotateY(0.0001);

  renderer.render(scene, camera);
};

render();

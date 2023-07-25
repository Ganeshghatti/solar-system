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
const canvas = document.querySelector(".threejs");

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(canvas.clientWidth, canvas.clientHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 50;
controls.maxDistance = 900;
camera.position.set(-130, 40, 50);
if (window.innerWidth<600) {
  camera.position.set(-250, 40, 50);
}
controls.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

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

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanete(size, texture, position, ring) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.texture,
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
}

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

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

function animate() {
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
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function createOrbit(radius) {
  const curve = new THREE.CatmullRomCurve3(getOrbitPoints(radius));
  const points = curve.getPoints(100);
  const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMat = new THREE.LineBasicMaterial({ color: 0xffffff });
  const orbit = new THREE.Line(orbitGeo, orbitMat);
  scene.add(orbit);
}

function getOrbitPoints(radius) {
  const points = [];
  for (let i = 0; i < 2 * Math.PI; i += 0.1) {
    points.push(
      new THREE.Vector3(radius * Math.cos(i), 0, radius * Math.sin(i))
    );
  }
  return points;
}

// Create orbits for each planet (add this before the animate function)
createOrbit(28); // Mercury
createOrbit(44); // Venus
createOrbit(62); // Earth
createOrbit(78); // Mars
createOrbit(100); // Jupiter
createOrbit(138); // Saturn
createOrbit(176); // Uranus
createOrbit(200); // Neptune

canvas.addEventListener("click", onCanvasClick);

function onCanvasClick(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  for (const intersect of intersects) {
    const object = intersect.object;
    switch (object) {
      case sun:
        planetsdata("sun");
        break;
      case mercury.mesh:
        planetsdata("mercury");
        break;
      case venus.mesh:
        planetsdata("venus");
        break;
      case earth.mesh:
        planetsdata("earth");
      case mars.mesh:
        planetsdata("mars");
        break;
      case jupiter.mesh:
        planetsdata("jupiter");
        break;
      case saturn.mesh:
        planetsdata("saturn");
        break;
      case uranus.mesh:
        planetsdata("uranus");
        break;
      case neptune.mesh:
        planetsdata("neptune");
        break;
      default:
        break;
    }
  }
}
function planetsdata(name) {
  const apiKey = "LDpvN/hnbvyKI/WSp9FYoA==kvWSYLGPFdYzhWBe";
  const apiUrl = `https://api.api-ninjas.com/v1/planets?name=${name}`;

  fetch(apiUrl, {
    method: "GET",
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const earthMass = 5.972e24;
      const planetMass = data[0].mass * earthMass;

      const earthRadius = 6371e3;
      const planetRadius = data[0].radius * earthRadius;

      document.getElementsByClassName("name")[0].innerHTML = `${data[0].name}`;
      document.getElementsByClassName("mass")[0].innerHTML = `${planetMass
        .toExponential(3)
        .replace("e", " x 10<sup>")}</sup> kg`;
      document.getElementsByClassName("radius")[0].innerHTML = `${planetRadius
        .toExponential(3)
        .replace("e", " x 10<sup>")}</sup> m`;
      document.getElementsByClassName(
        "period"
      )[0].innerHTML = `${data[0].period} days`;
      document.getElementsByClassName(
        "temperature"
      )[0].innerHTML = `${data[0].temperature} kelvin`;
      document.getElementsByClassName("container")[0].style.display = "block";
      document.getElementsByClassName("layer")[0].style.display = "block";
    })
    .catch((error) => {
      console.error("Error: ", error.message);
    });
}

const layer = document.getElementsByClassName("layer")[0];
layer.addEventListener("click", closef);
document
  .getElementsByClassName("fa-xmark")[0]
  .addEventListener("click", closef);
function closef() {
  document.getElementsByClassName("container")[0].style.display = "none";
  document.getElementsByClassName("layer")[0].style.display = "none";
}

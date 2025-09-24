import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('app');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting: even lighting using Hemisphere + Directional for soft shadows
const hemi = new THREE.HemisphereLight(0xffffff, 0x080808, 0.6);
hemi.position.set(0, 50, 0);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 1.2);
// point the directional light in the opposite direction (initial)
dir.position.set(-5, 10, -7.5);
dir.castShadow = true;
// default shadow camera bounds (will be tuned to model once loaded)
dir.shadow.camera.top = 10;
dir.shadow.camera.bottom = -10;
dir.shadow.camera.left = -10;
dir.shadow.camera.right = 10;
dir.shadow.mapSize.set(2048, 2048);
// soften shadows a bit and avoid acne
dir.shadow.bias = -0.0005;
dir.shadow.radius = 4;
scene.add(dir);
// ensure the light target is part of the scene so we can update it later
scene.add(dir.target);

// Floor
const floorMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.1, roughness: 0.8 });
const floorGeo = new THREE.PlaneGeometry(200, 200);
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

// Load model
const loader = new GLTFLoader();
// Configure DRACO loader to decode compressed meshes. Using Google's CDN for decoder files.
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);
loader.load('/assets/models/PC.glb', (gltf) => {
  const model = gltf.scene;
  // enable shadows on meshes
  model.traverse((n) => {
    if (n.isMesh) {
      n.castShadow = true;
      n.receiveShadow = true;
      // If mesh uses a material named "Glass", replace it with a glass-like material
      const replaceWithGlass = (mat) => {
        // preserve common maps/colors where possible
        const params = {};
        if (mat.map) params.map = mat.map;
        if (mat.color) params.color = mat.color.clone();
        // glass-like physical material
        return new THREE.MeshPhysicalMaterial({
          ...params,
          transparent: true,
          opacity: 1,
          transmission: 1.0,
          roughness: 0.05,
          metalness: 0,
          ior: 1.45,
          clearcoat: 1.0,
          clearcoatRoughness: 0.0,
          reflectivity: 0.5,
          side: THREE.DoubleSide,
        });
      };

      if (n.material) {
        if (Array.isArray(n.material)) {
          n.material = n.material.map((m) => (m && m.name === 'Glass' ? replaceWithGlass(m) : m));
        } else if (n.material.name === 'Glass') {
          n.material = replaceWithGlass(n.material);
        }
      }
    }
  });

  scene.add(model);

  // Compute bounding box to place model on the floor and frame the camera
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  // Move model so its min Y is at y=0 (standing on the floor)
  const min = box.min;
  model.position.y += -min.y;

  // Center model horizontally on X/Z
  model.position.x += -center.x;
  model.position.z += -center.z;

  // Position camera to nicely fit the model
  const radius = Math.max(size.length() * 0.5, 1);
  // If the glTF contains a camera node, use it as the initial camera
  let camNode = null;
  model.traverse((n) => {
    if (n.isCamera) camNode = n;
  });

  if (camNode) {
    // Copy camera parameters
    if (camNode.isPerspectiveCamera) {
      camera.fov = camNode.fov;
      camera.near = camNode.near;
      camera.far = camNode.far;
      camera.updateProjectionMatrix();
    }
    // Copy world transform from the camera node
    const worldPos = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    camNode.getWorldPosition(worldPos);
    camNode.getWorldQuaternion(worldQuat);
    camera.position.copy(worldPos);
    camera.quaternion.copy(worldQuat);
    controls.target.copy(center);
  } else {
    // Fallback: position camera to nicely fit the model
    camera.position.set(center.x + radius * 1.5, center.y + radius * 1.2, center.z + radius * 1.5);
    camera.lookAt(center);
    controls.target.copy(center);
  }

  // point directional light at the model center
  dir.target.position.copy(center);
  // Make the directional light stronger and focus its shadow camera on the model
  dir.intensity = 2.0;
  // Reposition the light relative to the model center for a focused key light
  dir.position.set(center.x - radius * 1.0, center.y + radius * 1.5, center.z - radius * 1.0);
  // Tighten shadow camera to the model size for higher-quality focused shadows
  const shadowExtent = Math.max(radius * 1.5, 1.5);
  dir.shadow.camera.left = -shadowExtent;
  dir.shadow.camera.right = shadowExtent;
  dir.shadow.camera.top = shadowExtent;
  dir.shadow.camera.bottom = -shadowExtent;
  dir.shadow.mapSize.set(4096, 4096);
  dir.shadow.bias = -0.0005;
  dir.shadow.radius = 6;
  controls.update();
}, undefined, (err) => {
  console.error('Error loading model:', err);
});

// Handle resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

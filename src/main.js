import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { initUI } from './ui.js';

const container = document.getElementById('viewerCanvas');
const ui = initUI();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = envTexture;
pmremGenerator.dispose();

const clock = new THREE.Clock();

function resizeRenderer() {
  const { clientWidth, clientHeight } = container;
  if (!clientWidth || !clientHeight) {
    return;
  }
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
}

resizeRenderer();

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

// Animation state
let mixer = null;
let fanAnimations = [];
let onOffAnimation = null;
let powerButton = null;
let isPowered = false;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Load model
const loader = new GLTFLoader();
// Configure DRACO loader to decode compressed meshes. Using Google's CDN for decoder files.
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);
loader.load('/assets/models/PC.glb', (gltf) => {
  const model = gltf.scene;
  
  // Setup animation mixer
  mixer = new THREE.AnimationMixer(model);
  
  // Find and setup animations
  const fanAnimationNames = ['Fan_front_01', 'Fan_front_02', 'Fan_front_03', 'Fan_back_01', 'Fan_mid_01', 'Fan_gpu_01', 'Fan_gpu_02'];
  
  console.log('Available animations:');
  gltf.animations.forEach(clip => {
    console.log('- Animation name:', clip.name);
  });
  
  gltf.animations.forEach(clip => {
    if (fanAnimationNames.includes(clip.name)) {
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopRepeat);
      fanAnimations.push(action);
      console.log('Fan animation added:', clip.name);
    } else if (clip.name === 'OnOff') {
      onOffAnimation = mixer.clipAction(clip);
      onOffAnimation.setLoop(THREE.LoopOnce);
      onOffAnimation.clampWhenFinished = true;
      console.log('OnOff animation found and set up');
    }
  });

  console.log('Fan animations count:', fanAnimations.length);
  console.log('OnOff animation found:', !!onOffAnimation);

  // enable shadows on meshes and find PowerButton
  model.traverse((n) => {
    if (n.isMesh) {
      n.castShadow = true;
      n.receiveShadow = true;
      
      // Find the PowerButton mesh
      if (n.name === 'PowerButton' || n.name === 'PowerButton_1') {
        powerButton = n;
        console.log('PowerButton mesh found:', n.name, n);
        console.log('PowerButton position:', n.position);
        console.log('PowerButton material:', n.material);
        
        // Add a visual helper to highlight the power button (optional)
        const buttonHelper = new THREE.BoxHelper(n, 0x00ff00);
        scene.add(buttonHelper);
      }
      
      // If mesh uses a material named "Glass", replace it with a glass-like material
      const replaceWithGlass = (mat) => {
        const params = {};
        if (mat.map) params.map = mat.map;
        if (mat.color) params.color = mat.color.clone();
        // Match the original Threejs_glass material specs more closely
        return new THREE.MeshPhysicalMaterial({
          ...params,
          transparent: true,
          opacity: 1,
          transmission: 1,
          roughness: 0, // Perfectly smooth like original
          metalness: 0,
          ior: 1.5, // Standard glass IOR
          thickness: 0, // Match original
          attenuationColor: new THREE.Color(0xffffff),
          specularIntensity: 1,
          specularColor: new THREE.Color(0xffffff),
          envMapIntensity: 1,
          reflectivity: 0.5, // Match original
          clearcoat: 0, // Match original (no clearcoat)
          clearcoatRoughness: 0,
          side: THREE.DoubleSide, // Match original side: 2
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

  // Debug: Log all mesh names to help identify the correct power button name
  console.log('All mesh names in the model:');
  model.traverse((n) => {
    if (n.isMesh) {
      console.log('- Mesh name:', n.name);
    }
  });
  
  if (!powerButton) {
    console.warn('PowerButton mesh not found! Check the mesh names above.');
  } else {
    console.log('PowerButton successfully found and set up for clicking.');
  }

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
  resizeRenderer();
}
window.addEventListener('resize', onWindowResize);

function onCanvasPointerDown(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length === 0) {
    console.log('No mesh clicked');
    return;
  }

  const clickedObject = intersects[0].object;
  console.log('Clicked on mesh:', clickedObject.name);
  console.log('Mesh object:', clickedObject);
  console.log('Distance:', intersects[0].distance);
  console.log('Point:', intersects[0].point);

  // If the power button has child meshes, allow clicking any descendant
  if (powerButton && (clickedObject === powerButton || powerButton.children.includes(clickedObject))) {
    console.log('Power button clicked!');
    togglePower();
  }
}

function togglePower() {
  console.log('Power button clicked! Current state:', isPowered);
  
  if (!mixer) {
    console.error('No mixer available');
    return;
  }

  // Always trigger the OnOff animation
  if (onOffAnimation) {
    console.log('Playing OnOff animation');
    onOffAnimation.reset();
    onOffAnimation.play();
  } else {
    console.warn('OnOff animation not found - check animation names in console');
  }

  isPowered = !isPowered;
  console.log('New power state:', isPowered);

  if (isPowered) {
    console.log('Starting', fanAnimations.length, 'fan animations');
    // Start all fan animations
    fanAnimations.forEach((action, index) => {
      action.reset();
      action.play();
      console.log('Started fan animation', index);
    });
  } else {
    console.log('Stopping', fanAnimations.length, 'fan animations');
    // Gradually stop all fan animations
    fanAnimations.forEach((action, index) => {
      // Fade out over 2 seconds
      action.fadeOut(2.0);
      console.log('Fading out fan animation', index);
    });
  }
}

renderer.domElement.addEventListener('pointerdown', onCanvasPointerDown);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  
  // Update animation mixer
  if (mixer) {
    const delta = clock.getDelta();
    mixer.update(delta);
  }
  
  renderer.render(scene, camera);
}
animate();

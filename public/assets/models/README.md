Place your 3D model files and textures in this folder.

Recommended formats:

- .glb / .gltf (binary / JSON + resources) — preferred for modern workflows
- .obj + .mtl (older, may require textures)
- .fbx (may need conversion)

How files are served:

- Anything placed here will be available at /assets/models/<filename>
  for example: /assets/models/scene.glb

Loading from code (example using GLTFLoader):

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
loader.load('/assets/models/scene.glb', (gltf) => {
scene.add(gltf.scene);
});

Notes:

- If you want to import model files through the bundler (so they get hashed and optimized), prefer putting them under `src/assets` and importing with `new URL('./assets/scene.glb', import.meta.url)` or direct import depending on loader support.
- Keep textures next to their models or in a `textures/` subfolder and adjust paths accordingly.

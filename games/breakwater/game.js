import { boot } from '../shared/scene-runtime.js';
import { world } from '../shared/worlds.js';

boot('breakwater', world).then(() => {
  document.querySelector('#loading').hidden = true;
}).catch(error => {
  console.error(error);
  document.querySelector('#loading').textContent = 'The 3D scene could not start. This game needs WebGL2. Press Restart to try again.';
});

// Single shared rotation state — one module instance, imported by both
// Hero.tsx (buttons) and SceneWithControls.tsx (useFrame)
export const rotation = { target: 0, current: 0 };

export function rotateLeft() {
  rotation.target -= Math.PI / 2;
}

export function rotateRight() {
  rotation.target += Math.PI / 2;
}

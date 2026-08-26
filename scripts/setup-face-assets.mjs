// Copies MediaPipe WASM runtime + face landmarker model into public/ so
// expression estimation runs fully on-device (no CDN calls at runtime).
import { cpSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

mkdirSync(resolve(root, 'public/mediapipe/wasm'), { recursive: true });
cpSync(
  resolve(root, 'node_modules/@mediapipe/tasks-vision/wasm'),
  resolve(root, 'public/mediapipe/wasm'),
  { recursive: true }
);
console.log('Copied tasks-vision wasm -> public/mediapipe/wasm');

const modelUrl =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task';
const modelDest = resolve(root, 'public/models/face_landmarker.task');

if (!existsSync(modelDest)) {
  const res = await fetch(modelUrl);
  if (!res.ok) throw new Error(`Model download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(modelDest), { recursive: true });
  writeFileSync(modelDest, buf);
  console.log(`Downloaded face landmarker (${(buf.length / 1e6).toFixed(1)} MB) -> ${modelDest}`);
} else {
  console.log('Face landmarker already present.');
}

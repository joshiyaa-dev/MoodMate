// Simple script to generate placeholder audio files for demo
// This creates silent audio files that can be replaced with real music

const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, '../public/assets/music');

// Ensure directory exists
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Create placeholder audio files (silent WAV files)
const tracks = [
  'ocean-waves.wav',
  'forest-whispers.wav', 
  'mountain-breeze.wav',
  'gentle-rain.wav',
  'starlight-serenade.wav',
  'moonbeam-melody.wav',
  'crystal-stream.wav',
  'sunset-harmony.wav',
  'dawn-chorus.wav',
  'bamboo-grove.wav',
  'lavender-fields.wav',
  'cosmic-journey.wav',
  'inner-peace.wav',
  'healing-light.wav',
  'sacred-space.wav',
  'tranquil-garden.wav',
  'mystic-waters.wav',
  'ethereal-winds.wav',
  'celestial-dreams.wav'
];

// Simple WAV header for 30 seconds of silence at 44.1kHz, 16-bit, mono
const createSilentWav = (durationSeconds = 30) => {
  const sampleRate = 44100;
  const bitsPerSample = 16;
  const channels = 1;
  const dataSize = sampleRate * durationSeconds * channels * (bitsPerSample / 8);
  const fileSize = 44 + dataSize;
  
  const buffer = Buffer.alloc(44 + dataSize);
  
  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize - 8, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // PCM format size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(channels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  // Data is already zeros (silence)
  
  return buffer;
};

console.log('Generating placeholder audio files...');

tracks.forEach((track, index) => {
  const filePath = path.join(audioDir, track);
  const audioBuffer = createSilentWav(30 + (index * 5)); // Varying durations
  
  fs.writeFileSync(filePath, audioBuffer);
  console.log(`Created: ${track}`);
});

console.log(`Generated ${tracks.length} placeholder audio files.`);
console.log('Replace these with real royalty-free music for production use.');
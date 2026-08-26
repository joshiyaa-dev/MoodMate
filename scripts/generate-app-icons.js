const fs = require('fs');
const path = require('path');

// Icon generation script for Capacitor Android
// This script helps set up app icons from Mindmate Logo.png

const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72, 
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

console.log('📱 Mindmate App Icon Setup Guide');
console.log('================================');
console.log('');
console.log('🎨 Your logo file: Mindmate Logo.png');
console.log('');
console.log('📋 To generate proper Android app icons:');
console.log('');
console.log('1. 🌐 Visit: https://easyappicon.com/');
console.log('2. 📁 Upload your "Mindmate Logo.png" file');
console.log('3. ⚙️  Select Android platform');
console.log('4. 📦 Download the generated icon pack');
console.log('5. 📂 Extract and copy files to:');
console.log('   android/app/src/main/res/');
console.log('');
console.log('Required Android icon files:');
Object.entries(iconSizes).forEach(([folder, size]) => {
  console.log(`   ${folder}/ic_launcher.png (${size}x${size}px)`);
  console.log(`   ${folder}/ic_launcher_round.png (${size}x${size}px)`);
});
console.log('');
console.log('🔄 After copying icons, run:');
console.log('   npm run build:mobile');
console.log('   npm run android:dev');
console.log('');
console.log('✨ Your Mindmate app will then have the custom icon!');

// Check if source logo exists
const logoPath = path.join(__dirname, '..', 'Mindmate Logo.png');
if (fs.existsSync(logoPath)) {
  console.log('✅ Source logo found: Mindmate Logo.png');
} else {
  console.log('❌ Logo file not found. Please ensure "Mindmate Logo.png" exists in project root.');
}

// Check current Android icon structure
const androidResPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
if (fs.existsSync(androidResPath)) {
  console.log('✅ Android resources folder found');
  
  // List current icon files
  console.log('\n📋 Current Android icons:');
  Object.keys(iconSizes).forEach(folder => {
    const folderPath = path.join(androidResPath, folder);
    if (fs.existsSync(folderPath)) {
      const launcherIcon = path.join(folderPath, 'ic_launcher.png');
      const launcherRound = path.join(folderPath, 'ic_launcher_round.png');
      
      const hasLauncher = fs.existsSync(launcherIcon);
      const hasRound = fs.existsSync(launcherRound);
      
      console.log(`   ${folder}: ${hasLauncher ? '✅' : '❌'} ic_launcher.png ${hasRound ? '✅' : '❌'} ic_launcher_round.png`);
    }
  });
} else {
  console.log('❌ Android resources folder not found');
}

console.log('\n🚀 Once icons are updated, your app will display the Mindmate logo!');
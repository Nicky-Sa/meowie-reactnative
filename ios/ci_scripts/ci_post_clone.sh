#!/bin/bash
set -e

echo "🛠 Running ci_post_clone.sh"

# cd out of ios/ci_scripts into main project directory
cd ../../

echo "🍺 Installing node and cocoapods..."
brew install node cocoapods

echo "📦 Installing npm dependencies..."
npm install

echo "🩹 Applying patches..."
npm i patch-package
npx patch-package

echo "⚙️ Running Expo prebuild..."
CI="true" npx expo prebuild --platform ios

echo "📚 Running pod install..."
cd ios
pod install

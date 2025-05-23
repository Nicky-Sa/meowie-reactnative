#!/bin/bash
set -e

echo "🛠 Running ci_post_clone.sh"

# Install Node modules
echo "📦 Installing npm dependencies..."
npm install

# Patch dependencies
echo "🩹 Applying patches..."
npm i patch-package
npx patch-package

# Run Expo prebuild with CI workaround
echo "⚙️ Running Expo prebuild..."
CI="true" npx expo prebuild --platform ios

# Install CocoaPods dependencies
echo "📚 Running pod install..."
cd ios
pod install

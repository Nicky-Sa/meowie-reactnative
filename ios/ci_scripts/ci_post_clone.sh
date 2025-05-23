#!/bin/zsh

echo "===== Moving to project root ====="
cd ..
echo "===== Installling CocoaPods ====="
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
brew install cocoapods
echo "===== Installing Node.js ====="
brew install node@22

# Install dependencies
echo "===== Running npm install ====="
npm install
echo "===== Running prebuild for iOS ====="
expo prebuild --platform ios

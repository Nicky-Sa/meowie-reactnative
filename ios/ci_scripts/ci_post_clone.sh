#!/bin/zsh

ls -a
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
echo "===== Running pod install ====="
cd ios || echo "ios directory not found"
pod install

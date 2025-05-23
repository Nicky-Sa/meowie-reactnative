#!/bin.bash
set -e
echo "Running ci_post_clone.sh"

# install node and cocoapods
brew install node cocoapods

# install node modules
npm install


CI="true" npx expo prebuild --platform ios

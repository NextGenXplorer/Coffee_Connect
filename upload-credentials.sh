#!/bin/bash
# Upload keystore credentials to EAS

echo "Uploading keystore credentials to EAS..."

# Set keystore details as environment variables
export EXPO_ANDROID_KEYSTORE_PATH="./alice.jks"
export EXPO_ANDROID_KEYSTORE_PASSWORD="724d59d01eaf69baddd49b611433d930"
export EXPO_ANDROID_KEY_ALIAS="648d27a7825c34819c28c32d5946ebe9"
export EXPO_ANDROID_KEY_PASSWORD="c8733afb57c573147b8b310485a83d4e"

# Upload credentials using eas build (will detect and upload on first build)
echo "Credentials configured. Run 'eas build --platform android --profile production' to upload and build."

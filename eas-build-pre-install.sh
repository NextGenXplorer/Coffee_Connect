#!/bin/bash
# EAS Build Pre-Install Hook - Set up Android Keystore

set -e

echo "🔐 Setting up Android keystore from environment variables..."

if [ -n "$ANDROID_KEYSTORE_BASE64" ]; then
  echo "📦 Decoding keystore..."
  echo "$ANDROID_KEYSTORE_BASE64" | base64 -d > "$EAS_BUILD_WORKINGDIR/alice.jks"
  chmod 600 "$EAS_BUILD_WORKINGDIR/alice.jks"

  # Create gradle.properties with keystore configuration
  echo "⚙️ Configuring Gradle properties..."
  cat >> "$EAS_BUILD_WORKINGDIR/android/gradle.properties" << EOF

# Keystore configuration
MYAPP_UPLOAD_STORE_FILE=../alice.jks
MYAPP_UPLOAD_KEY_ALIAS=$ANDROID_KEY_ALIAS
MYAPP_UPLOAD_STORE_PASSWORD=$ANDROID_KEYSTORE_PASSWORD
MYAPP_UPLOAD_KEY_PASSWORD=$ANDROID_KEY_PASSWORD
EOF

  echo "✅ Keystore configured successfully!"
else
  echo "⚠️ No ANDROID_KEYSTORE_BASE64 environment variable found"
  echo "❌ Build will fail without keystore credentials"
  exit 1
fi

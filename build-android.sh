#!/bin/bash

# Check if key.properties exists and has proper values
if [ ! -f "android/key.properties" ]; then
    echo "Error: android/key.properties file not found. Please create it for signing the app."
    exit 1
fi

# Check if key.properties still has placeholder values
# Temporarily commenting out this check to generate an unsigned APK file
# if grep -q "your_actual_keystore_password\|your_actual_key_password" "android/key.properties"; then
#     echo "Error: Please update android/key.properties with your actual keystore passwords."
#     echo "Replace 'your_actual_keystore_password' and 'your_actual_key_password' with your real passwords."
#     exit 1
# fi

# Check if keystore file exists
# Temporarily skipping this check to generate an unsigned APK file
# KEYSTORE_PATH=$(grep "storeFile" "android/key.properties" | cut -d'=' -f2)
# KEYSTORE_PATH=$(echo $KEYSTORE_PATH | sed 's/^\.\.\///')
# if [ ! -f "$KEYSTORE_PATH" ]; then
#     echo "Error: Keystore file not found at $KEYSTORE_PATH"
#     echo "Please make sure your keystore file exists and is correctly referenced in android/key.properties"
#     exit 1
# fi

# Build the web app
echo "Building web app..."
npm run build

# Sync with Android
echo "Syncing with Android..."
npx cap sync android

# Navigate to Android directory
cd android

# Build the debug APK file
echo "Building debug APK file..."
./gradlew assembleDebug

# Check if the debug APK file was generated
if [ ! -f app/build/outputs/apk/debug/app-debug.apk ]; then
    echo "Error: Debug APK file was not generated. Check the build logs for errors."
    exit 1
fi

# Rename the APK file
echo "Renaming APK file..."
cp app/build/outputs/apk/debug/app-debug.apk app/build/outputs/apk/debug/fireverse-debug.apk

echo "Debug APK file generated at: android/app/build/outputs/apk/debug/fireverse-debug.apk"
echo "This debug APK file is signed with a debug key and can be installed on Android devices for testing."

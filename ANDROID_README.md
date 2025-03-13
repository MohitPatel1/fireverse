# Fireverse Android App

This document provides instructions for building and deploying the Fireverse Android app.

## Prerequisites

- Node.js and npm
- Android Studio
- JDK 18 or newer
- Android SDK with Android 15 (API level 35) support

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Build the web app:
   ```
   npm run build
   ```

3. Sync with Android:
   ```
   npx cap sync android
   ```

## Development

To open the project in Android Studio:
```
npx cap open android
```

## Building for Release

### Creating a Keystore for Signing

Before building for release, you must create a keystore file to sign your app. This is required by the Google Play Store.

1. Create a keystore file using the keytool command:
   ```
   keytool -genkey -v -keystore fireverse-release-key.keystore -alias fireverse -keyalg RSA -keysize 2048 -validity 10000
   ```

2. When prompted, enter a password for the keystore and key, and provide the requested information.

3. Create a `key.properties` file in the `android` directory with the following content:
   ```
   storePassword=your_keystore_password
   keyPassword=your_key_password
   keyAlias=fireverse
   storeFile=../../fireverse-release-key.keystore
   ```

4. Replace `your_keystore_password` and `your_key_password` with the actual passwords you used when creating the keystore.

### Using the Build Script

1. Make sure you have created a keystore file and configured `android/key.properties` with your keystore information as described above.

2. Run the build script:
   ```
   ./build-android.sh
   ```

3. The signed AAB file will be generated at `android/app/build/outputs/bundle/release/app-release.aab`

### Manual Build

1. Build the web app:
   ```
   npm run build
   ```

2. Sync with Android:
   ```
   npx cap sync android
   ```

3. Navigate to the Android directory:
   ```
   cd android
   ```

4. Build the AAB file:
   ```
   ./gradlew bundleRelease
   ```

## Android 15 Support

This app targets Android 15 (API level 35), which is the latest version of Android. Some key features of Android 15 that are used in this app include:

- Edge-to-edge display support
- Latest Material Design components
- Enhanced performance and security features

## Deploying to Google Play Store

1. Sign in to the [Google Play Console](https://play.google.com/console)

2. Create a new app or select your existing app

3. Navigate to "Production" > "Create new release"

4. Upload the AAB file from `android/app/build/outputs/bundle/release/app-release.aab`
   - Make sure the AAB file is properly signed with your keystore
   - If you get an error saying "All uploaded bundles must be signed", check that your `key.properties` file has the correct passwords

5. Fill in the release details and submit for review

### Important Notes About App Signing

- **Keep your keystore file safe**: If you lose it, you won't be able to update your app on the Play Store
- **Remember your keystore passwords**: Store them securely as you'll need them for every app update
- **App Signing by Google Play**: Consider enabling Google Play App Signing for additional security

## Troubleshooting

- If you encounter build errors, try cleaning the project:
  ```
  cd android
  ./gradlew clean
  ```

- For signing issues:
  - Verify your keystore configuration in `android/key.properties` and `android/app/build.gradle`
  - Make sure the keystore file exists at the path specified in `key.properties`
  - Ensure you've replaced the placeholder passwords with your actual keystore passwords

- If the AAB file is not being signed:
  - Check that the `signingConfig signingConfigs.release` line is properly applied in the `buildTypes` section of `android/app/build.gradle`
  - Verify that the keystore file is valid by running:
    ```
    keytool -list -v -keystore fireverse-release-key.keystore
    ```

- For more information, refer to the [Capacitor documentation](https://capacitorjs.com/docs) 
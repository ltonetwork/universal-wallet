# LTO Wallet

## Install

Install required dependencies for the project.

```bash
yarn install
```

## Use node core modules in a RN project

In order to use non-React-Native dependencies, like crypto module, you'll need to follow the next step as React Native packager can't package node core modules.

```bash
yarn postinstall
```

## Environment Variables

Create a .env file and add the following environmental variables:

Enter LTO API endpoint to get a detailed balance of your account with the format: `.../addresses/balance/details/`:

```bash
LTO_API_URL=
```

App receives info of LTO Network price on real time from Coinmarketcap API so you'll need to enter your CMC API key:

```bash
CMC_API_KEY=
```

The network you are going to use 'M' for mainnet and 'T' for testnet:

```bash
LTO_NETWORK_ID=
```

You also can refer to the `.env.example` file within the repository.

## To run on Android/IOS

To run the project first [configure SDK](https://reactnative.dev/docs/running-on-device) and [sign the Android app](https://reactnative.dev/docs/signed-apk-android) (explained below). Once configured and as this is an expo ejected project, you can initialize it by running:

Android:

```bash
yarn react-native run-android
```

IOS:

```bash
yarn react-native run-ios
```

On both cases, metro bundler will start and will load the app.

## Signing the Android app

To configure the signing you need to have the keystore.

Then you need to store the following envvars in your `$HOME/.gradle/gradle.properties`.

You can follow [this tutorial](https://reactnative.dev/docs/signed-apk-android#setting-up-gradle-variables) and [this one](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/) to see how to configure the mac keychain to use this.

```bash
 # $HOME/.gradle/gradle.properties
LTO_UPLOAD_STORE_FILE=android-release.keystore  # The keystore file path
LTO_UPLOAD_KEY_ALIAS=my-key-alias               # The alias of the keystore file
LTO_MAC_USERNAME=javaguirre                     # your mac user name
LTO_MAC_KEYSTORE_NAME=lto-android               # Your mac keychain store name (see link above)
```

## Prepare Android build

To get a new and updated apk debug file use:

```bash
cd android
./gradlew assembleDebug
```

This will [generate an apk](https://reactnative.dev/docs/signed-apk-android#generating-the-release-aab) for testing purposes

## Prepare IOS build

To update `main.jsbundle` so project is prepared to be uploaded for testing purposes or to the appstore use:

```bash
yarn build:ios
```

Then you can build the app for release following [these indications](https://reactnative.dev/docs/publishing-to-app-store#3-build-app-for-release)

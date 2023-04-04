![LTO github readme](https://user-images.githubusercontent.com/100821/196711741-96cd4ba5-932a-4e95-b420-42d4d61c21fd.png)

# LTO Universal Wallet

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

To run the project first [configure SDK](https://reactnative.dev/docs/running-on-device) and
[sign the Android app](https://reactnative.dev/docs/signed-apk-android) (explained below). Once configured and as this
is an expo ejected project, you can initialize it by running:

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

```
keytool -genkey -v -keystore android/app/lto.keystore -alias lto -keyalg RSA -keysize 2048 -validity 10000
```

Follow [this tutorial](https://reactnative.dev/docs/signed-apk-android#setting-up-gradle-variables) to configure gradle
properties. You'll need to store the following env vars in `$HOME/.gradle/gradle.properties` or `android/local.properties`.

```bash
LTO_UPLOAD_STORE_FILE=lto.keystore
LTO_UPLOAD_KEY_ALIAS=lto
LTO_UPLOAD_STORE_PASSWORD=*****
LTO_UPLOAD_KEY_PASSWORD=*****
```

If you are using a mac, you can follow [this article](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/)
to see how to configure the mac keychain and prevent your keystore password to be stored in plain text.

## Prepare Android build

To update `index.android.bundle` so project is prepared and updated use:

```bash
yarn build:android
```

To get a new apk debug file use:

```bash
yarn build:android:apk
```

This will generate APK Debug file so you can test your app on your device directly or mount it on emulator.

To get a release version use:

```bash
yarn build:android:aab
```

This will bundle and generate AAB file, ready to be uploaded to Google Play Console. Follow [these indications](https://reactnative.dev/docs/signed-apk-android#generating-the-release-aab)

## Prepare iOS build

To update `main.jsbundle` so project is prepared to be uploaded for testing purposes or to the App Store use:

```bash
yarn build:ios
```

Then you can build the app for release following [these indications](https://reactnative.dev/docs/publishing-to-app-store#3-build-app-for-release)

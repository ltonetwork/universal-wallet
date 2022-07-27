# LTO Wallet

## Install

```bash
yarn
```

## Develop

```bash
yarn start
```

## To run on Android/IOS

[First configure SDK](https://reactnative.dev/docs/running-on-device)

Then...

```bash
yarn run android
```

Or...

```bash
yarn run ios
```

## Signing the Android app

To configure the signing you need to have the keystore, @javaguirre will provide it.

Then you need to store the following envvars in your `$HOME/.gradle/gradle.properties`.

You can follow [this tutorial](https://reactnative.dev/docs/signed-apk-android) and [this one](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/) to see how to configure the mac keychain to use this.

```bash
 # $HOME/.gradle/gradle.properties
LTO_UPLOAD_STORE_FILE=android-release.keystore  # The keystore file path
LTO_UPLOAD_KEY_ALIAS=my-key-alias               # The alias of the keystore file
LTO_MAC_USERNAME=javaguirre                     # your mac user name
LTO_MAC_KEYSTORE_NAME=lto-android               # Your mac keychain store name (see link above)
```

After configuring it you just use:

```bash
cd android
./gradlew assembleRelease
```

# Development

## Requirements

- Node.js with npm
- Expo CLI through the project dependency tree
- Android Studio and Android SDK for Android builds
- Java version compatible with the Expo/React Native Android toolchain

Install dependencies:

```sh
npm install
```

## Common Commands

```sh
npm run mobile          # Expo dev server
npm run mobile:web      # Web preview
npm run typecheck       # TypeScript check
make android            # Open on Android through Expo Go
make android-dev        # Build/install native Android debug build
make android-release    # Build/install local Android release APK
make android-launch     # Launch installed Android package
```

`make` targets are thin wrappers around root npm scripts.

## Android SDK Helper

The root Android scripts call `scripts/with_android_env.sh`.

The helper:

- uses `ANDROID_HOME` or `ANDROID_SDK_ROOT` when already set
- otherwise defaults to `$HOME/Library/Android/sdk`
- prepends Android `platform-tools` and `emulator` to `PATH`
- writes `apps/mobile/android/local.properties` when the generated native Android folder exists

The generated native folders are intentionally ignored:

```txt
apps/mobile/android/
apps/mobile/ios/
```

Regenerate them with Expo commands when needed.

## Android Emulator

Start an emulator, then run:

```sh
make android
```

That opens through Expo Go and is the fastest iteration path.

If your shell exports `EXPO_OFFLINE=1`, the `make android` wrapper clears it before launching Expo Go. Expo Go may need network access the first time it installs or opens on a fresh emulator.

If you want a native debug app instead of Expo Go, run:

```sh
make android-dev
```

For a native app install:

```sh
make android-release
make android-launch
```

Expo may open a development-client deep link after install. `make android-launch` launches the installed package directly.

## Real Android Device

1. Connect the phone by USB.
2. Enable developer mode on the phone: Settings > About phone > tap Build number 7 times.
3. Enable USB debugging: Settings > System > Developer options > USB debugging.
4. Accept the RSA debugging prompt on the phone.
5. Check that ADB sees it:

```sh
make android-devices
```

On macOS, Android Studio platform tools are usually enough. Windows may require the phone vendor's OEM USB driver.

If only one Android device is connected:

```sh
make android-release
make android-launch
```

If both an emulator and a real phone are connected, use Expo's device picker:

```sh
make android-release-device
```

For direct ADB launch on a specific device:

```sh
ANDROID_SERIAL=<device-serial> make android-launch
```

## Real Device Install Restrictions

If install fails with:

```txt
INSTALL_FAILED_USER_RESTRICTED
```

the APK built successfully but the phone blocked ADB installation. On Xiaomi/Redmi/MIUI devices, check Developer options and enable:

- USB debugging
- Install via USB
- USB debugging (Security settings), if present

Keep the phone unlocked and accept any install confirmation prompt. Then retry the already-built APK without rebuilding:

```sh
ANDROID_SERIAL=<device-serial> make android-install-release
ANDROID_SERIAL=<device-serial> make android-launch
```

## Word-Pack Regeneration

Generated word-pack JSON is committed. Raw source files are not committed.

To regenerate content, place `en-600.pdf` and `en-1500.xls` at the repo root locally, then run:

```sh
npm run extract:words
```

Do not edit generated word-pack JSON by hand unless the correction is documented and intentionally source-data-specific.

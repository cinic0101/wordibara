#!/usr/bin/env sh
set -eu

SDK_DIR="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}}"

if [ ! -d "$SDK_DIR" ]; then
  cat >&2 <<EOF
Android SDK not found.

Set ANDROID_HOME or ANDROID_SDK_ROOT, or install Android Studio's SDK at:
  $HOME/Library/Android/sdk
EOF
  exit 1
fi

export ANDROID_HOME="$SDK_DIR"
export ANDROID_SDK_ROOT="$SDK_DIR"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

if [ -d "apps/mobile/android" ]; then
  printf "sdk.dir=%s\n" "$SDK_DIR" > apps/mobile/android/local.properties
fi

exec "$@"

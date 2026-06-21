#!/usr/bin/env sh
set -eu

if [ "${EXPO_OFFLINE:-}" = "1" ] || [ "${EXPO_OFFLINE:-}" = "true" ]; then
  cat >&2 <<'EOF'
make android uses Expo Go, so EXPO_OFFLINE is being cleared for this command.
Use make android-dev if you want a native debug build instead of the Expo Go flow.
EOF
  unset EXPO_OFFLINE
fi

exec npm run android --workspace @wordibara/mobile

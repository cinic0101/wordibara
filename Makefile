.PHONY: install mobile web android android-dev android-device android-devices android-launch android-release android-release-device typecheck extract-words

install:
	npm install

mobile:
	npm run mobile

web:
	npm run mobile:web

android:
	npm run mobile:android

android-dev:
	npm run mobile:android:dev

android-device:
	npm run mobile:android:dev:device

android-devices:
	npm run mobile:android:devices

android-launch:
	npm run mobile:android:launch

android-release:
	npm run mobile:android:release

android-release-device:
	npm run mobile:android:release:device

typecheck:
	npm run typecheck

extract-words:
	npm run extract:words

.PHONY: install mobile web android android-dev android-launch android-release typecheck extract-words

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

android-launch:
	npm run mobile:android:launch

android-release:
	npm run mobile:android:release

typecheck:
	npm run typecheck

extract-words:
	npm run extract:words

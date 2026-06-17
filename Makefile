.PHONY: install mobile web android android-dev typecheck extract-words

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

typecheck:
	npm run typecheck

extract-words:
	npm run extract:words

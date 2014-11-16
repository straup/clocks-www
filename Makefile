js: js-deps js-clocks

js-deps:
	cat www/javascript/localforage.min.js www/javascript/snap.svg.min.js www/javascript/clock.min.js > www/javascript/clocks.dependencies.min.js

js-clocks:
	java -Xmx64m -jar lib/google-compiler/compiler-20100616.jar --js www/javascript/clocks.js > www/javascript/clocks.combined.min.js


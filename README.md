# clocks-www

A very simple web application for creating and displaying multiple clocks using
Simon Jones' [svg-clock](https://github.com/simonrjones/svg-clock). Clocks are
stored locally to the web browser using Mozilla's
[localforage](https://mozilla.github.io/localForage/) offline storage
libraries.

There is also [a version of the
code](https://github.com/straup/clocks-www/blob/master/www/offline.html)
designed to work offline using the [Application Cache API](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache?redirectlocale=en-US&redirectslug=Offline_resources_in_Firefox).

## Caveats

Currently you will need to know the number of hours offset _from UTC_ of the
location you are creating a clock for. This is absolutely not a feature but all
of the code and UI required to make that work as-if-like-magic is complicated
enough that it's been saved for a future release. It's not ideal but that's how
it is for now.

## See also

* https://github.com/simonrjones/svg-clock
* https://github.com/mozilla/localforage


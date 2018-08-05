/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const gulp = require('gulp');
const workbox = require('workbox-build');

const dist = `${__dirname}/build/esm-bundled`;

gulp.task('generate-service-worker', () => {
  return workbox.injectManifest({
    globDirectory: dist,
    globPatterns: [
      '**/*.{html,js}',
      'manifest.json'
    ],
    swSrc: `${__dirname}/sw.js`,
    swDest: `${dist}/service-worker.js`
  }).then(({warnings}) => {
    // In case there are any warnings from workbox-build, log them.
    for (const warning of warnings) {
      console.warn(warning);
    }
    console.info('Service worker generation completed.');
  }).catch((error) => {
    console.warn('Service worker generation failed:', error);
  });
});

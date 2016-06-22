gulp-import-tasks
=================

Imports gulp tasks from a local directory, rather than from your gulpfile.

Based on [gulp-load-tasks][external_gulp-load-tasks], but better (and actively maintained)!



***



Install
-------

```
$ npm install gulp-import-tasks
```

<small>**Note:** [`gulp`][external_gulp] is a required peer dependency.</small>


Usage
-----------

#### Quick Start

Simply require the package within your `gulpfile.js`. By default, this will load all gulp tasks that exist within a local `tasks` directory.

```js
// gulpfile.js

require('gulp-import-tasks')();
```

```js
// tasks/default.js

module.exports = [
  'clean'
];
```

```js
// tasks/clean.js

const clean = require('gulp-clean');

module.exports = function (gulp) {
  gulp.clean('dist', { read: false })
    .pipe(clean());
};
```


#### Custom Directory

You can customize the tasks directory by passing in the name of your custom directory as the first parameter. The following will check for tasks within the `gulp/tasks` directory.

```js
// gulpfile.js

require('gulp-import-tasks')('gulp/tasks');
```

Or, you can define it by passing in an options object instead. See [advanced usage](#advanced).

```js
// gulpfile.js

require('gulp-import-tasks')({
  dir: 'gulp/tasks'
});
```


Advanced
--------

Using the options parameter, you may specify permisible file extensions, as well as any additional function parameters.

#### Options

| Option       | Type             | Default   |
|:-------------|:-----------------|:----------|
| `dir`        | `string`         | `tasks`   |
| `extensions` | `Array.<string>` | `['.js']` |
| `params`     | `Array.<any>`    | `[]`      |


#### Usage

```js
// gulpfile.js

const config = {
  build: 'dist'
};

require('gulp-import-tasks')({
  dir: 'gulp/tasks',
  extensions: ['.js'],
  params: [
    config
  ]
});
```

```js
// tasks/clean.js

const clean = require('gulp-clean');

module.exports = function (gulp, config) {
  gulp.clean(config.build, { read: false })
    .pipe(clean());
};
```


Authors
-------
* [Nathan Buchar]


License
-------
MIT




[Nathan Buchar]: mailto:hello@nathanbuchar.com

[external_gulp-load-tasks]: https://npmjs.com/package/gulp-load-tasks
[external_gulp]: https://npmjs.com/package/gulp

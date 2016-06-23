gulp-import-tasks
=================

Imports Gulp tasks from a local directory, rather than from your gulpfile.

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

Simply require the package within your `gulpfile.js`. By default, this will load all Gulp tasks that exist within a local `tasks` directory.

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
  return gulp.clean('dist', { read: false })
    .pipe(clean());
};
```

As you can see above, `gulp-import-tasks` will automatically send `gulp` as the first function parameter. You can add additional parameters using [advanced options][section_advanced].


#### Custom Directory

You can customize the tasks directory by passing in the name of your custom directory as the first parameter. The following will check for tasks within the `gulp/tasks` directory.

```js
// gulpfile.js

require('gulp-import-tasks')('gulp/tasks');
```

Or, you can define it by passing in an options object instead. See [advanced usage][section_advanced].

```js
// gulpfile.js

require('gulp-import-tasks')({
  dir: 'gulp/tasks'
});
```


#### Asynchronous Tasks

Not yet supported – accepting pull requests.


Advanced
--------

Using the options parameter, you may specify permissible file extensions, as well as any additional function parameters.

#### Options

| Option       | Type             | Description                                                          | Default   |
|:-------------|:-----------------|:---------------------------------------------------------------------|:----------|
| `dir`        | `string`         | The directory that contains your Gulp tasks.                         | `tasks`   |
| `extensions` | `Array.<string>` | Only load files from the tasks directory that have these extensions. | `['.js']` |
| `params`     | `Array.<any>`    | Additional parameters to pass into imported task.                    | `[]`      |


#### Example

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
// gulp/tasks/default.js

module.exports = [
  'clean'
];
```

```js
// gulp/tasks/clean.js

const clean = require('gulp-clean');

module.exports = function (gulp, config) {
  return gulp.clean(config.build, { read: false })
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

[section_install]: #install
[section_usage]: #usage
[section_advanced]: #advanced

[external_gulp-load-tasks]: https://npmjs.com/package/gulp-load-tasks
[external_gulp-async]: https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support
[external_gulp]: https://npmjs.com/package/gulp

/**
 * Imports gulp tasks from a local directory, rather than from your gulpfile.
 *
 * @module gulpImportTasks
 * @requires gulp
 * @exports {Function} importTasks
 * @author Nathan Buchar
 * @license MIT
 */

'use strict';

const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const debug = require('debug')('gulp-import-tasks');

/**
 * The default directory to import tasks from.
 *
 * @type {string}
 */
const DEFAULT_DIRECTORY = 'tasks';

/**
 * The default directory file extensions.
 *
 * @type {Array.<string>}
 */
const DEFAULT_EXTENSIONS = ['.js'];

/**
 * The default array of parameters.
 *
 * @type {Array.<*>}
 */
const DEFAULT_PARAMS = [];

/**
 * This builds the task object. A gulp task may be either an array or a
 * function, so we must handle both. If it is an array, we return it
 * immediately, otherwise we create a new function with the correctly-bounded
 * parameters.
 *
 * @param {Array|Function} task
 * @param {Object} options
 * @returns {Array|Function}
 */
function parseTaskObject(task, options) {
  if (Array.isArray(task)) {
    return task;
  } else {
    return task.bind(null, gulp, ...options.params);
  }
}

/**
 * Registers a Gulp task given a file and a set of options.
 *
 * @param {Object} file
 * @param {Object} options
 */
function registerTask(file, options) {
  const task = require(file.path);
  const taskName = path.basename(file.path, file.ext);
  const taskObject = parseTaskObject(task, options);

  // Register this task with Gulp.
  gulp.task.call(gulp, taskName, taskObject);

  debug(`registered "${taskName}" task`);
}

/**
 * Parses relevant file properties into a single object.
 *
 * @param {string} dir
 * @param {string} filename
 * @returns {Object}
 */
function parseFile(dir, filename) {
  const filePath = path.join(dir, filename);
  const fileStat = fs.statSync(filePath);
  const fileExt = path.extname(filename);

  return {
    path: filePath,
    stat: fileStat,
    ext: fileExt
  };
}

/**
 * Creates a closure that is invoked for each item in the chosen directory.
 * Verifies that the item is a file and of the correct type, then registers
 * the task.
 *
 * @param {string} dir
 * @param {Object} options
 * @returns {Function}
 */
function handleFile(dir, options) {
  return filename => {
    const file = parseFile(dir, filename);

    debug(`found "${filename}"`);

    // Exit early if this item is not a file.
    if (!file.stat.isFile()) {
      debug(`skipped "${filename}" (not a file)`);
      return;
    }

    // Exit early if this item is not the right file type.
    if (!options.extensions.includes(file.ext)) {
      debug(`skipped "${filename}" (incorrect file type)`);
      return;
    }

    registerTask(file, options);
  };
}

/**
 * Extends default options with user options.
 *
 * @param {Object} options
 * @returns {Object}
 */
function extendDefaultOptions(options) {
  return Object.assign({
    dir: DEFAULT_DIRECTORY,
    extensions: DEFAULT_EXTENSIONS,
    params: DEFAULT_PARAMS
  }, options);
}

/**
 * Parses the options parameter into the final form.
 *
 * @param {Object|string} options
 * @returns {Object}
 */
function parseOptions(options) {
  if (typeof options === 'string') {
    return extendDefaultOptions({
      dir: options
    });
  } else {
    return extendDefaultOptions(options);
  }
}

/**
 * Registers all gulp tasks within the given directory.
 *
 * @param {Object|string} [options]
 * @param {string} [options.dir='tasks']
 * @param {Array.<string>} [options.extensions=['.js']]
 * @param {Array.<*>} [options.params=[]]
 */
function importTasks(options) {
  const opts = parseOptions(options);
  const cwd = process.cwd();
  const dir = path.join(cwd, opts.dir);

  debug(`importing tasks from "${dir}"...`);

  // This synchronously reads the contents within the chosen directory then
  // loops through each item, verifies that it is in fact a file of the correct
  // file type, then creates the tasks object and registers it with gulp.
  fs.readdirSync(dir).forEach(
    handleFile(dir, opts)
  );

  debug(`finished importing tasks`);
};

module.exports = importTasks;

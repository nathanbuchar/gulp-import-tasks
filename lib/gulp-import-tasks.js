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

/**
 * The default directory to load tasks from.
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
    return task.bind.apply(task, [task, gulp].concat(options.params));
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
  const opts = parseOptions(option);
  const cwd = process.cwd();
  const dir = path.join(cwd, opts.dir);

  // This synchronously reads the contents within the chosen directory then
  // loops through each item, verifies that it is in fact a file of the correct
  // file type, then creates the tasks object and registers it with gulp.
  fs.readdirSync(dir).forEach(filename => {
    const filePath = path.join(dir, filename);
    const fileStat = fs.statSync(filePath);
    const fileExt = path.extname(filename);

    // Verify that this item is in fact a file, and that is of the correct
    // file type. If it is not, we do not continue, as it is not valid or does
    // not match our criteria.
    if (fileStat.isFile() && opts.extensions.includes(fileExt)) {
      const task = require(filePath);
      const taskName = path.basename(filePath, fileExt);
      const taskObject = parseTaskObject(task, opts);

      // Register this task with Gulp.
      gulp.task.call(gulp, taskName, taskObject);
    }
  });
};

module.exports = importTasks;

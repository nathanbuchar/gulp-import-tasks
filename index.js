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
 * Gets the absolute path to the given directory.
 *
 * @param {string} dir
 * @returns {string}
 */
function getPathToDirectory(dir) {
  return path.join(process.cwd(), dir);
}

/**
 * Loads all files within the given directory.
 *
 * @param {string} dir
 * @returns {string[]}
 */
function loadFilesWithinDirectory(dir) {
  return fs.readdirSync(dir);
}

/**
 * Registers all gulp tasks within the given directory.
 *
 * @param {Object|string} [options]
 * @param {string} [options.dir='tasks']
 * @param {Array.<string>} [options.extensions=['.js']]
 * @param {Array.<*>} [options.params=[gulp]]
 */
function loadTasks(options) {
  let opts = options;
  let dir;
  let files;

  // Convert options to Object if it is a string.
  if (typeof options === 'string') {
    opts = {
      dir: options
    };
  }

  opts = extendDefaultOptions(opts);
  dir = getPathToDirectory(opts.dir);
  files = loadFilesWithinDirectory(dir);

  // Loop through each file and register it with Gulp
  // if it is valid.
  files.forEach(filename => {
    let file = path.join(dir, filename);
    let extension = path.extname(filename);
    let stat = fs.statSync(file);

    // Exit early if it is not a file, or if it is not
    // of the correct file type.
    if (!stat.isFile() || !opts.extensions.includes(extension)) {
      return;
    }

    let task = require(file);
    let taskName = path.basename(file, extension);
    let taskObject;

    if (!Array.isArray(task)) {
      taskObject = task;
    } else {
      taskObject = task.bind.apply(task, [task, gulp].concat(opts.params));
    }

    // Register this task with Gulp.
    gulp.task.call(gulp, taskName, taskObject);
  });
};

module.exports = loadTasks;


// Require dependencies
const fs         = require('fs-extra');
const gulp       = require('gulp');
const riot       = require('gulp-riot');
const concat     = require('gulp-concat');
const header     = require('gulp-header');
const rename     = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

// Require local dependencies
const config = require('config');

/**
 * Build riot task class
 *
 * @task     riot
 * @after    javascript
 * @priority 1
 */
class RiotTask {
  /**
   * Construct riot task class
   *
   * @param {gulp} gulp
   */
  constructor(runner) {
    // Set private variables
    this._runner = runner;

    // Bind methods
    this.run = this.run.bind(this);
    this.watch = this.watch.bind(this);

    // Bind private methods
    this._views = this._views.bind(this);
  }

  /**
   * Run riot task
   *
   * @return {Promise}
   */
  run(files) {
    // Create header
    let head    = '';
    const include = config.get('view.include') || {};

    // Loop include
    for (const key of Object.keys(include)) {
      head += `const ${key} = require ("${include[key]}");`;
    }

    // Return promise
    return new Promise((resolve, reject) => {
      // Await views
      this._views(files).then(() => {
        // Return promise
        gulp.src([
          `${global.appRoot}/data/cache/views/**/*.js`,
          `${global.appRoot}/data/cache/views/**/*.tag`,
          `!${global.appRoot}/data/cache/views/email/**/*.tag`,
        ])
          .pipe(sourcemaps.init())
          .pipe(riot({
            compact    : true,
            whitespace : false,
          }))
          .pipe(concat('tags.js'))
          .pipe(header('const riot = require ("riot");'))
          .pipe(gulp.dest(`${global.appRoot}/data/cache`))
          .pipe(header(head))
          .pipe(rename('tags.min.js'))
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest(`${global.appRoot}/data/cache`))
          .on('end', resolve)
          .on('error', reject);
      });
    });
  }

  /**
   * Watch task
   *
   * @return {Array}
   */
  watch() {
    // Return files
    return 'views/**/*';
  }

  /**
   * Run riot views
   *
   * @param {Array} files
   *
   * @return {Promise}
   * @private
   */
  _views(files) {
    // Remove views cache directory
    fs.removeSync(`${global.appRoot}/data/cache/views`);

    // Return promise
    return new Promise((resolve, reject) => {
      // Run gulp
      gulp.src(files)
        .pipe(rename((filePath) => {
          // Get amended
          let amended = filePath.dirname.replace(/\\/g, '/').split('bundles/');

          // Correct path
          amended = amended.pop();
          amended = amended.split('views');
          amended.shift();
          amended = amended.join('views');

          // Alter amended
          filePath.dirname = amended; // eslint-disable-line no-param-reassign
        }))
        .pipe(gulp.dest(`${global.appRoot}/data/cache/views`))
        .on('end', resolve)
        .on('error', reject);
    });
  }
}

/**
 * Export riot task
 *
 * @type {RiotTask}
 */
module.exports = RiotTask;

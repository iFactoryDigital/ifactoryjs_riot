
// Require dependencies
const riot   = require('riot');
const path   = require('path');
const Daemon = require('daemon');

/**
 * Build riot dameon class
 */
class RiotDaemon extends Daemon {
  /**
   * Construct riot daemon class
   *
   * @param {eden} eden
   */
  constructor() {
    // Run super
    super();

    // Require tags
    require('cache/emails'); // eslint-disable-line global-require

    // On render
    if (this.eden.router) {
      // require tags for router threads
      require('cache/tags'); // eslint-disable-line global-require

      // add pre for router only threads
      this.eden.pre('view.compile', (render) => {
        // Alter mount page
        // eslint-disable-next-line no-param-reassign
        render.mount.page = render.mount.page.includes('views') ? `${render.mount.page.split('views')[1].substr(path.sep.length).split(path.sep).join('-').trim()
          .replace('.tag', '')}-page` : render.mount.page;

        // Alter mount layout
        // eslint-disable-next-line no-param-reassign
        render.mount.layout = render.mount.layout.includes('-layout') ? render.mount.layout : `${render.mount.layout}-layout`;
      });

      // set view for router threads
      this.eden.view = this.render;
    }

    // Set eden view
    this.eden.email        = this.email;
    this.eden.renderString = this.renderString;
  }

  /**
   * Renders page view
   *
   * @param {Options} opts
   *
   * @return {String}
   */
  render(opts) {
    // Render page
    return riot.render(opts.mount.layout, opts);
  }

  /**
   * Render email template
   *
   * @param  {String} template
   * @param  {Options} options
   *
   * @return Promise
   */
  email(template, options) {
    // Return render
    return riot.render(`${template}-email`, options);
  }

  /**
   * Render pdf template
   *
   * @param  {String} template
   * @param  {Options} options
   *
   * @return Promise
   */
  renderString(template, options) {
    console.log(template);
    // Return render
    return riot.render(`${template}-string`, options);
  }
}

/**
 * Export riot daemon class
 *
 * @type {RiotDaemon}
 */
module.exports = RiotDaemon;

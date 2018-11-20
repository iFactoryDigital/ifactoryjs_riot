// Use strict

// Require dependencies
const socket = require('socket');
const Helper = require('helper');

// Require models
const user = model('user');

/**
 * Build riot controller
 */
class RiotHelper extends Helper {
  /**
   * Construct riot helper class
   */
  constructor() {
    // Run super
    super();

    // Bind private methods
    this.state = this.state.bind(this);
  }

  /**
   * Build state function
   *
   * @param  {User|Socket} send
   * @param  {String} url
   * @param  {Object} opts
   *
   * @private
   */
  async state(send, url, opts) {
    // Send user alert
    return await socket[send instanceof user ? 'user' : 'session'](send, 'state', {
      url,
      opts,
    });
  }
}

/**
 * Export Riot controller
 *
 * @type {RiotHelper}
 */
module.exports = new RiotHelper();

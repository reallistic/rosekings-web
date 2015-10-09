/*
 * Action definitions for the ParallaxStore.
 */

var Dispatcher = require('../flux/dispatcher'),
    Constants = require('../flux/constants');

var ParallaxActions = {

    /**
     * Force an event to fire.
     */
    forceEvent: function() {
        Dispatcher.dispatch({
            _type: Constants.PARALLAX_EMIT
        });
    },

    /**
     * Destroy the event listeners.
     * @param {Element=} opt_window The object to set the listeners on.
     * @param {String=} opt_name A name to key on for the window object.
     */
    destroy: function(opt_window, opt_name) {
        Dispatcher.dispatch({
            _type: Constants.PARALLAX_DESTROY,
            opt_window: opt_window || null,
            opt_name: opt_name || null
        });
    },

    /**
     * Do the initial setup of the event listeners.
     * @param {Element=} opt_window The object to set the listeners on.
     * @param {String=} opt_name A name to key on for the window object.
     */
    setup: function(opt_window, opt_name) {
        Dispatcher.dispatch({
            _type: Constants.PARALLAX_SETUP,
            opt_window: opt_window || null,
            opt_name: opt_name || null
        });
    }
};

module.exports = ParallaxActions;

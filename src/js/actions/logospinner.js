/*
 * Action definitions for the LogoSpinner
 */

var Dispatcher = require('../flux/dispatcher'),
    Constants = require('../flux/constants');

var LogoSpinnerActions = {

    /**
     * Add a image to the spinner
     * @param {string|array} imageUrl
     */
    addImage: function(imageUrl) {
        Dispatcher.dispatch({
            _type: Constants.SPINNER_ADD_IMAGE,
            imageUrl: imageUrl
        });
    },

    idle: function() {
        Dispatcher.dispatch({
            _type: Constants.SPINNER_IDLE
        });
    },

    next: function() {
        Dispatcher.dispatch({
            _type: Constants.SPINNER_NEXT
        });
    },

    /**
     * @param {number} opt_pos The position to start
     */
    wait: function(opt_pos) {
        Dispatcher.dispatch({
            _type: Constants.SPINNER_WAIT,
            pos: opt_pos
        });
    },

    /**
     * @param {number} opt_pos The position to start
     */
    stop: function(opt_pos) {
        Dispatcher.dispatch({
            _type: Constants.SPINNER_STOP,
            pos: opt_pos
        });
    },

    /**
     * @param {number} opt_pos The position to start
     */
    play: function(opt_pos) {
        Dispatcher.dispatch({
            _type: Constants.SPINNER_PLAY,
            pos: opt_pos
        });
    }
};

module.exports = LogoSpinnerActions;

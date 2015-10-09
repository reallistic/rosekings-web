'use strict';

/*
 * Window Size Store
 * Contains a singleton closure to the window resize events.
 */

var EventEmitter = require('events').EventEmitter,
    assign = require('object-assign'),
    throttle = require('../utils').Throttle;

var CHANGE_EVENT = 'WindowSizeChange';

var _size = {
    height: 0,
    width: 0
};

function _onResize() {
    var height = window.innerHeight,
        width = window.innerWidth;

    if(height !== _size.height || width !== _size.width){
        _size.height = window.innerHeight;
        _size.width = window.innerWidth;
        WindowSizeStore.emitChange();
    }
}

var WindowSizeStore = assign({}, EventEmitter.prototype, {
    /**
     * Do the initial setup of event listeners.
     */
    setup: function() {
        throttle('resize', 'throttledResize', window);
        window.addEventListener('throttledResize', _onResize);
        _onResize();
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * Getter for window size.
     */
    getSize: function() {
        return _size;
    },

    /**
     * Listen for a CHANGE_EVENT
     * @param {function}
     */
    listen: function(callback) {
        this.on(CHANGE_EVENT, callback);
    }
});

module.exports = WindowSizeStore;

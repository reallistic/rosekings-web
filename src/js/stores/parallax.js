'use strict';

/*
 * Parrallax Store
 * Contains a singleton closure to the window scroll event data.
 */

var Dispatcher = require('../flux/dispatcher'),
    EventEmitter = require('events').EventEmitter,
    Constants = require('../flux/constants'),
    assign = require('object-assign'),
    KeyMirror = require('keymirror'),
    throttle = require('../utils').Throttle;

var CHANGE_EVENT = 'ParallaxChange';

var DIRECTION_TYPE = KeyMirror({
    HORIZONTAL: null,
    VERTICAL: null
});

var EVENT_TYPE = KeyMirror({
    READY: null
});

var _parallax = {};

var DEFAULT_NAME = 'default';
var DEFAULT_ELEMENT = window;

/**
 * Remove the scroll listener for the given element.
 * @param {Element} element The element to stop listen for scroll.
 * @param {String} name The name for use in referencing this element.
 */
function destroyEventListeners(element, name){
    var boundOnScroll = _parallax[name].onScroll;
    element.removeEventListener('throttledScroll', boundOnScroll);
};


/**
 * Setup the scroll listener for the given element.
 * @param {Element} element The element to listen for scroll.
 * @param {String} name The name for use in referencing this element.
 */
function setupEventListeners(element, name){
    var boundOnScroll = _onScroll.bind(null, name);
    //throttle('scroll', 'throttledScroll', element);
    //element.addEventListener('scroll', boundOnScroll);
    if(name in _parallax){
        throw 'Already setup'
    }
    _parallax[name] = {
        callbacks: [],
        lastDirection: null,
        onScroll: boundOnScroll,
        xScrollPercent: 0,
        yScrollPercent: 0
    };
};

/**
 * Fires on every scroll event thrown by window.
 * @param {String} name The name to reference the element.
 * @param {Event} e The event object.
 * @param {bool} manualFire Was this event fired manually.
 */
function _onScroll(name, e, manualFire){
    var element = e.target;
    var parallax =  _parallax[name];
    //element.scrollHeight - element.scrollTop === element.clientHeight
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
    var scrollTop, scrollLeft, height, width;
    if(element == window){
        if(element.pageYOffset !== undefined) {
            scrollTop = element.pageYOffset;
            scrollLeft = element.pageXOffset;
        }
        else{
            scrollTop = (element.documentElement || document.body).scrollTop;
            scrollLeft = (element.documentElement || document.body).scrollLeft;
        }
        height = element.innerHeight;
        width = element.innerWidth;
    }
    else {
        var rect = element.getBoundingClientRect();
        scrollTop = element.scrollTop;
        scrollLeft = element.scrollLeft;
        height = rect.height || (rect.right - rect.left);
        width = rect.width || (rect.bottom - rect.top);
    }
    var xPercent = scrollLeft/width * 100,
        yPercent = scrollTop/height * 100;

    // If both scrolls change set and emit both so that all
    // components listening get the values they need.
    var hasScrollChanged = false;
    if(xPercent !== parallax.xScrollPercent){
        parallax.xScrollPercent = xPercent;
        parallax.lastDirection = DIRECTION_TYPE.HORIZONTAL;
        hasScrollChanged = true;
    }

    if(yPercent !== parallax.yScrollPercent){
        parallax.yScrollPercent = yPercent;
        parallax.lastDirection = DIRECTION_TYPE.VERTICAL;
        hasScrollChanged = true;
    }

    if(hasScrollChanged){
        ParallaxStore.dispatchChange(name);
    }

};


var ParallaxStore = assign({}, EventEmitter.prototype, {

    /**
     * Do the initial setup of the event listeners.
     * @param {Element=} opt_window The object to set the listeners on.
     * @param {String=} opt_name A name to key on for the window object.
     */
    setupScroller: function(opt_window, opt_name){
        var element = opt_window || window,
            name = opt_name || DEFAULT_NAME;
        console.log('setup scroller', element);
        setupEventListeners(element, name);
        ParallaxStore.emitEvent(EVENT_TYPE.READY);
    },

    /**
     * Returns the current scroll percentages.
     * @param {String=} opt_name The named reference.
     * @return {object}
     */
    getScrollPercent: function(opt_name) {
        var name = opt_name || DEFAULT_NAME;
        return {
            x: _parallax[name].xScrollPercent,
            y: _parallax[name].yScrollPercent,
            direction: _parallax[name].lastDirection
        };
    },

    /**
     * Returns the last scroll direction.
     * @param {String=} opt_name The named reference.
     * @return {string}
     */
    getDirection: function(opt_name) {
        var name = opt_name || DEFAULT_NAME;
        return _parallax[name].lastDirection;
    },

    /**
     * Dispatch a change to the callbacks.
     * @param {String} name The named element to emit for.
     */
    dispatchChange: function(name) {
        var event_name = name + '_' + CHANGE_EVENT;
        _parallax[name].callbacks.forEach(function(cb){
            cb();
        });
        //this.emit(event_name);
    },

    /**
     * Listen for a CHANGE_EVENT
     * @param {String=} opt_name The named element to listen for.
     * @param {function} callback Function to call.
     */
    watch: function(opt_name, callback) {
        var name = opt_name || DEFAULT_NAME;
        var event_name = name + '_' + CHANGE_EVENT;
        _parallax[name].callbacks.push(callback);
    },

    /**
     * Stop listen for a CHANGE_EVENT
     * @param {String=} opt_name The named element to stop listen for.
     * @param {function} callback Function to call.
     */
    unWatch: function(opt_name, callback) {
        var name = opt_name || DEFAULT_NAME;
        var event_name = name + '_' + CHANGE_EVENT;
        var callbacks = _parallax[name].callbacks.filter(function(cb){
            return cb !== callback;
        });
    },

    /**
     * Emit a event
     * @param {String} event_name The name of the event.
     */
    emitEvent: function(event_name) {
        this.emit(event_name);
    },

    /**
     * Listen for an event
     * @param {String} event_name The event to listen for.
     */
    listen: function(event_name, callback) {
        this.on(event_name, callback);
    },

    /**
     * Stop listen for a CHANGE_EVENT
     * @param {String} event_name The name of the event.
     * @param {function} callback Function to call.
     */
    removeListener: function(event_name, callback) {
        this.removeListener(event_name, callback);
    },

    DirectionType: DIRECTION_TYPE,

    EventType: EVENT_TYPE
});

// Register callback for all action updates
Dispatcher.register(function(action) {

    var shouldEmitChange = false,
        element = action.element || window,
        name = action.name || DEFAULT_NAME;

    switch(action._type) {
        case Constants.PARALLAX_EMIT:
            shouldEmitChange = true;
        break;
        case Constants.PARALLAX_DESTROY:
            destroyEventListeners(element, name);
        break;
        case Constants.PARALLAX_SETUP:
            setupEventListeners(element, name);
            ParallaxStore.emitEvent(EVENT_TYPE.READY);
        break;
        default:
        break;
    }

    if(shouldEmitChange){
        ParallaxStore.dispatchChange(name);
    }
});

module.exports = ParallaxStore;

/*
 * LogoSpinnerStore
 * Contains a singleton closure to the actual data.
 */

var Dispatcher = require('../flux/dispatcher'),
    EventEmitter = require('events').EventEmitter,
    Constants = require('../flux/constants'),
    assign = require('object-assign'),
    KeyMirror = require('keymirror');

var CHANGE_EVENT = 'LogoSpinnerChange';

var STATUS_TYPE = KeyMirror({
    IDLE: null,
    LOADING: null,
    PLAYING: null,
    STOPPED: null,
    WAITING: null
});

var _logoSpinner = {
    cycles: null,
    images: [],
    length: 0,
    position: -1,
    status: STATUS_TYPE.LOADING
};

var _timeout = null;
var MAX_IDLE_CYCLES = 2;

/**
 * Add an image to the spinner.
 * @param {event} e
 */
function _addImageAfterLoad(e) {

    if(_logoSpinner.images.indexOf(e.target.src) === -1){
        var dataPos = parseInt(e.target.getAttribute("data-pos"));
        _logoSpinner.images[dataPos] = e.target.src;
        if(_logoSpinner.position === -1 && dataPos === 0) {
            _logoSpinner.position = 0;
        }
        else if(_logoSpinner.length-1 === dataPos){
            _logoSpinner.status = STATUS_TYPE.WAITING;
            LogoSpinnerStore.emitChange(); 
        }
    }
}

/**
 * Add an image to the spinner.
 * @param {string|array} imageUrl
 */
function addImage(imageUrl) {
    if(Array.isArray(imageUrl)){
        var i=0; length = imageUrl.length;
        for(; i<length; i++){
            addImage(imageUrl[i]);
        }
    }
    else {
        var image = new Image();
        image.onload = _addImageAfterLoad;
        image.src = imageUrl;
        image.setAttribute("data-pos", _logoSpinner.length++);
    }
}

/**
 * Announce the next image
 */
function nextImage() {

    var shouldEmitChange = true;

    if(_logoSpinner.length) {
        _logoSpinner.position++;
    }
    else {
        shouldEmitChange = false;
        _logoSpinner.position = -1;
    }

    if(_logoSpinner.position >= _logoSpinner.length){
        if(_logoSpinner.status === STATUS_TYPE.IDLE) {
            _logoSpinner.cycles++;
        }
        _logoSpinner.position = 0;
    }

    if(shouldEmitChange) {
        LogoSpinnerStore.emitChange();
    }
}

/**
 * Idle cycle through all images
 */
function idleCycle() {
    if(_logoSpinner.cycles === null){
        _logoSpinner.cycles = 0;
        _logoSpinner.position = 0;
    }

    if(_logoSpinner.cycles < MAX_IDLE_CYCLES) {
        nextImage();
        _timeout = setTimeout(idleCycle, 100);
    }
    else {
        _logoSpinner.status = STATUS_TYPE.WAITING
        _logoSpinner.cycles = null;
        LogoSpinnerStore.emitChange();
    }
}

function cancelIdle() {
    if(_timeout) {
        clearTimeout(_timeout);
    }
    _logoSpinner.cycles = null;
}

var LogoSpinnerStore = assign({}, EventEmitter.prototype, {

    /**
     * Returns all the images currently loaded
     * @return {array}
     */
    getAllImages: function() {
        return _logoSpinner.images.slice(0);
    },

    /**
     * Returns the current image
     * @return {string}
     */
    getCurrentImage: function() {
        if(_logoSpinner.length && _logoSpinner.position >= 0) {
            return _logoSpinner.images[_logoSpinner.position];
        }

        return null;
    },

    /**
     * Returns the current status
     * @return {string}
     */
    getStatus: function() {
        return _logoSpinner.status;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * Listen for a CHANGE_EVENT
     * @param {function}
     */
    listen: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * Stop listening for a CHANGE_EVENT
     * @param {function}
     */
    stopListen: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    StatusType: STATUS_TYPE
});

// Register callback for all action updates
Dispatcher.register(function(action) {

    var shouldEmitChange = true;

    switch(action._type) {
        case Constants.SPINNER_WAIT:
            cancelIdle();
            _logoSpinner.status = STATUS_TYPE.WAITING;
            if (action.pos !== null){
                _logoSpinner.position = action.pos;
            }
        break;

        case Constants.SPINNER_STOP:
            cancelIdle();
            _logoSpinner.status = STATUS_TYPE.STOPPED;
            if (action.pos !== null){
                _logoSpinner.position = action.pos;
            }
        break;

        case Constants.SPINNER_IDLE:
            _logoSpinner.status = STATUS_TYPE.IDLE;
            idleCycle();
        break;

        case Constants.SPINNER_NEXT:
            cancelIdle();
            nextImage();
            shouldEmitChange = false;
        break;

        case Constants.SPINNER_PLAY:
            cancelIdle();
            _logoSpinner.status = STATUS_TYPE.PLAYING;
            if (action.pos){
                _logoSpinner.position = action.pos;
            }
        break;

        case Constants.SPINNER_ADD_IMAGE:
            shouldEmitChange = false;
            addImage(action.imageUrl);
        break;

        default:
        break;
    }

    if(shouldEmitChange){
        LogoSpinnerStore.emitChange();
    }
});

module.exports = LogoSpinnerStore;

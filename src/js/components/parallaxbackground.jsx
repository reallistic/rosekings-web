/** @jsx React.DOM */
"use strict";
var React = require("react"),
    ParallaxStore = require('../stores/parallax'),
    ParallaxActions = require('../actions/parallax'),
    Resize = require('../mixins/resize');

module.exports = React.createClass({
    displayName: "ParallaxBackground",

    propTypes: {
        xSpeed: React.PropTypes.number,
        ySpeed: React.PropTypes.number,
        xPos: React.PropTypes.number,
        yPos: React.PropTypes.number,
        background: React.PropTypes.string,
        enabled: React.PropTypes.bool,
        scrollElement: React.PropTypes.element,
        scrollElementName: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            scrollElement: null,
            scrollElementName: null,
            xPos: 0,
            yPos: 0,
            ySpeed: 1,
            xSpeed: 1,
            enabled: true
        };
    },

    getInitialState: function() {
        return {
            yPos: 0,
            xPos: 0
        };
    },

    componentWillUnmount: function() {
        if(this.props.enabled){
            ParallaxStore.unWatch(this.props.scrollElementName,
                                  this.computeSway);
            ParallaxStore.removeListener(ParallaxStore.EventType.READY,
                                         this.initializeCallbacks);
        }
    },

    componentWillMount: function() {
        if(this.props.enabled){
            ParallaxStore.listen(ParallaxStore.EventType.READY,
                                 this.initializeCallbacks);
        }
    },

    initializeCallbacks: function() {
        if(this.props.enabled){
            ParallaxStore.watch(this.props.scrollElementName,
                                this.computeSway);
        }
    },

    computeSway: function(e) {
        if(!this.props.enabled) {
            return;
        }
        var name = this.props.scrollElementName;
        var scroll = ParallaxStore.getScrollPercent(name);
        var yPos = (this.props.yPos + scroll.y) * this.props.ySpeed,
            xPos = (this.props.xPos + scroll.x) * this.props.xSpeed;
        //element.style.backgroundPositionY = yPos + '%';
        //element.style.backgroundPositionX = xPos + '%';
        this.setState({yPos: yPos, xPos: xPos});
    },

    render: function() {
        var style = {};
        if(this.props.enabled) {
            style.backgroundPositionY = this.state.yPos + '%';
            style.backgroundPositionX = this.state.xPos + '%';
        }
        var classes = 'w100 h100 parallax-background ';
        if(this.props.className){
            classes += this.props.className;
        }

        return <div className={classes} style={style} />;
    }
});

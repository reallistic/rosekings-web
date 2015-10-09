/** @jsx React.DOM */
"use strict";
var React = require("react"),
    ParallaxStore = require('../stores/parallax');

module.exports = React.createClass({
    displayName: "FloatingDiv",

    getInitialState: function() {
        return {
            callCount: 0,
            xScroll: 0,
            yScroll: 0
        }
    },

    componentWillMount: function() {
        ParallaxStore.listen(ParallaxStore.EventType.READY,
                             this.initializeCallbacks);
    },

    initializeCallbacks: function(){
        ParallaxStore.watch(null, this.onScroll);
    },

    onScroll: function() {
        var scroll = ParallaxStore.getScrollPercent();
        this.setState({callCount: this.state.callCount+1,
                       xScroll: scroll.x,
                       yScroll: scroll.y});
    },

    render: function(){
        return (
            <div className='floating-div'>
                <div>call count: {this.state.callCount}</div>
                <div>xScroll: {this.state.xScroll}</div>
                <div>yScroll: {this.state.yScroll}</div>
            </div>
        );
    }
});

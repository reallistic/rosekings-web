/** @jsx React.DOM */
"use strict";
var React = require("react");

module.exports = React.createClass({
    displayName: "ParallaxBackground",

    propTypes: {
        component: React.PropTypes.element.isRequired,
        speed: React.PropTypes.number.isRequired,
        xPos: React.PropTypes.string,
        yPos: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            xPos: null,
            yPos: null
        };
    },

    getInitialState: function() {
        return {
            offset: {
                top: 0,
                left: 0
            },
            yPos: 0
        };
    },

    componentWillUnmount: function() {
        if(this.props.yPos !== null) {
            window.removeEventListener('scroll', this.computeSway);
        }
    },

    componentWillMount: function() {
        if(this.props.yPos !== null) {
            window.addEventListener('scroll', this.computeSway);
        }
        else {
            this.setState({yPos: this.props.yPos});
        }
    },

    componentDidMount: function() {
        if(this.props.yPos !== null) {
            var offset = this.getDOMElement().parent.offset.top;
            this.setState({offset: offset});
        }
    },

    computeSway: function(e) {
        var scroll = e.target.scroll,
            top = scroll.top-this.state.offset.top,
            yPos = top * this.props.speed;
        this.setState({yPos: yPos});
    },

    render: function() {
        
    }
});

/** @jsx React.DOM */
'use strict';
var React = require('react'),
    Resize = require('../mixins/Resize');

module.exports = React.createClass({
    displayName: 'Section',

    mixins: [Resize],

    render: function() {
        var style = {
            height: this.state.windowHeight + 'px'
        };
        return (
            <section style={style}>
                {this.props.children}
            </section>
        );
    }
});

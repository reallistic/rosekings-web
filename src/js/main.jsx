/** @jsx React.DOM */
"use strict";
var React = require("react"),
    LogoSpinner = require("./components/logospinner.jsx");

var Main = React.createClass({
    render: function() {
        return (
            <div className="main">
                <LogoSpinner />
            </div>
        );
    }
});

React.render(<Main />, document.querySelector("#root"));

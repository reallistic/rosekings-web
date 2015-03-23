/** @jsx React.DOM */
"use strict";
var React = require("react"),
    LogoSpinnerStore = require("../stores/logospinner"),
    LogoSpinnerActions = require("../actions/logospinner");

var logoImages = [
    "/images/roselogo.jpg",
    "/images/roselogo1.jpg",
    "/images/roselogo2.jpg",
    "/images/roselogo3.jpg",
    "/images/roselogo4.jpg",
    "/images/roselogo5.jpg",
    "/images/roselogo6.jpg",
    "/images/roselogo7.jpg",
    "/images/roselogo8.jpg"
];

module.exports = React.createClass({
    displayName: "LogoSpinner",
    propTypes: {
        opt_enabled: React.PropTypes.bool,
    },

    getDefaultProps: function() {
        return {
            opt_enabled: true
        };
    },

    getInitialState: function() {
        return {
            image: null,
            timeout: null
        };
    },

    componentWillMount: function() {
        if(this.props.opt_enabled){
            LogoSpinnerActions.addImage(logoImages);
            LogoSpinnerStore.listen(this.onStoreChange);
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if(this.props.opt_enabled === nextProps.opt_enabled) {
            return;
        }

        if(nextProps.opt_enabled) {
            LogoSpinnerStore.listen(this.onStoreChange);
        }
        else {
            LogoSpinnerStore.stopListen(this.onStoreChange);
        }
    },

    onStoreChange: function(e) {
        var timeout = this.state.timeout;
        switch(LogoSpinnerStore.getStatus()) {
            case LogoSpinnerStore.StatusType.PLAYING:
                if(timeout){
                    clearTimeout(timeout);
                }
                timeout = setTimeout(LogoSpinnerActions.next, 100);
            break;

            case LogoSpinnerStore.StatusType.WAITING:
                if(timeout){
                    clearTimeout(timeout);
                }
                timeout = setTimeout(LogoSpinnerActions.idle, 5000);
            break;

            case LogoSpinnerStore.StatusType.STOPPED:
                if(timeout){
                    clearTimeout(timeout);
                }
            break;

            case LogoSpinnerStore.StatusType.IDLE:
            default:
            break;
        }
        this.setState({image: LogoSpinnerStore.getCurrentImage(),
                       timeout: timeout});
    },

    _onMouseOut: function(e) {
        if(this.props.opt_enabled) {
            LogoSpinnerActions.wait(0);
        }
    },

    _onMouseOver: function(e) {
        if(this.props.opt_enabled) {
            LogoSpinnerActions.play();
        }
    },

    render: function() {
        return (
        <section id="home" data-speed="6" data-type="background">
            <div className="background-sway hidden-sm hidden-xs"></div>
            <div className="container">
                <div className="centered">
                    <a href="https://rose-llc.com" onMouseOver={this._onMouseOver}
                        onMouseOut={this._onMouseOut}>
                        <img id="logo-cycle" src={this.state.image} width="210" height="208" border="0" />
                    </a>
                </div>
            </div>
            <div className="next">
                <span data-type="nextsection" data-next="about" className="glyphicon glyphicon-chevron-down" />
            </div>
            <div className="window-shade" />
        </section>
        );
            
    }
});

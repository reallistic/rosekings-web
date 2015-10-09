'use strict';

var WindowSizeStore = require('../stores/windowsize');

module.exports = {
    componentDidMount: function() {
        WindowSizeStore.listen(this.setDimensions);
    },

    getInitialState: function() {
        return {
            containerHeight: 0,
            containerWidth: 0,
            windowHeight: 0,
            windowWidth: 0
        };
    },

    setDimensions: function() {
        var element = this.getDOMNode();
        element = element.parentNode || element;
        var rect = element.getBoundingClientRect(),
            height = rect.height || (rect.right - rect.left),
            width = rect.width || (rect.bottom - rect.top);
        this.setState({containerHeight: height,
                       containerWidth: width,
                       windowHeight: WindowSizeStore.getSize().height,
                       windowWidth: WindowSizeStore.getSize().width});
    }

};

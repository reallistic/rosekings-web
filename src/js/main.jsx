/** @jsx React.DOM */
'use strict';
var React = require('react'),
    FloatingDiv = require('./components/floatingdiv.jsx'),
    LogoSpinner = require('./components/logospinner.jsx'),
    ParallaxActions = require('./actions/parallax'),
    ParallaxBackground = require('./components/parallaxbackground.jsx'),
    ParallaxStore = require('./stores/parallax'),
    Section = require('./components/section.jsx'),
    WindowSizeStore = require('./stores/windowsize');

var Main = React.createClass({
    displayName: 'main',

    componentDidMount: function()  {
        WindowSizeStore.setup();
        ParallaxStore.setupScroller(this.refs.scrollable.getDOMNode());
    },

    render: function() {
        return (
            <div className='scrollable' ref='scrollable'>
                <div className='h100'>
                    <Section name='intro'>
                        <ParallaxBackground enabled={false}
                           className={'about'}/>
                        <ParallaxBackground xPos={50} ySpeed={1}
                            className={'about2'}/>
                        <LogoSpinner />
                    </Section>
                    <Section name='about'>
                        <ParallaxBackground yPos={-50} ySpeed={1} xPos={50}
                            className={'norepeat bgx50 kingsslash_c'}/>
                        <ParallaxBackground yPos={-100} ySpeed={-1}
                            className={'norepeat bgx0 kingsslash_tl'}/>
                        <ParallaxBackground yPos={-100} ySpeed={1} xPos={100}
                            className={'norepeat bgx100 kingsslash_tr'}/>
                        <ParallaxBackground yPos={0} ySpeed={1}
                            className={'norepeat bgx0 kingsslash_bl'}/>
                        <ParallaxBackground yPos={-200} ySpeed={-1} xPos={100}
                            className={'norepeat bgx100 kingsslash_br'}/>
                    </Section>
                    <Section name='contact'>
                        <ParallaxBackground speed={5}/>
                        <div style={{position: 'relative'}}>
                            <h1> Drop us a line!</h1>
                            <h3>For quotes, information, or just to say hey.</h3>
                        </div>
                    </Section>
                    { /*<FloatingDiv /> */}
                </div>
            </div>
        );
    }
});

React.render(<Main />, document.querySelector('body'));

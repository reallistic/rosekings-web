react-gulp-template
===================

Gulpfile template for react


# Install

```
git clone https://github.com/rxsegrxup/react-gulp-template.git
cd react-gulp-template
make install
```

# Running an app

```
make run
```

This will spin up a local server on port :8000. Navigate to http://localhost:8000 to see your app

# Adding react code/html

All of your code should go in ./src/. With this template, you can use require to manage dependencies.

For example, you could have the following structure:

```
src/
    components/
        Header.jsx
        Footer.jsx
    main.jsx
```

And use these components in `main.jsx` like so:

```
/** @jsx React.DOM */
"use strict";
var React = require("react");
var Header = require('./components/Header.jsx');
var Footer = require('./components/Footer.jsx');

var Main = React.createClass({
    render: function(){
        return (
            <section>
                <Header />
                {/* code */}
                <Footer />
            </section>
        );
    }
});

React.render(<Main />, document.querySelector("#root"));
```

The components themselves need to "export" their class:
```
/** @jsx React.DOM */
"use strict";
var React = require("react");

module.exports = React.createClass({
    displayName: "Header",
    render: function(){
        return <h1>Hello World!</h1>;
    }
});
```
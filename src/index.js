import shadow from 'utils/shadow.js';

import React from 'react';
import ReactDOM from 'react-dom';

// note that CSS loads here and shadow function
// executes for the first time (calling it from css loader)!
import App from './App';

// shadow root is already created, so for the second time function
// just returns the link to it.
// We can move this line BEFORE App import or hide it
// in the shadow function, that will make things slightly easier,
// but in real projects I stopped with current pattern
const src = shadow().appendChild( document.createElement('div') );

src.style.height = '100%';
src.style.position = 'relative';

ReactDOM.render(<App />, src);

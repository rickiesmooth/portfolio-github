import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import 'font-awesome/css/font-awesome.min.css';
import Home from './pages/Home';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Home />, document.getElementById('root'));

serviceWorker.unregister();

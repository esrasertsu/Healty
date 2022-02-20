import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import './app/layout/fonts/GT-Eesti-Pro-Display-Medium.woff2'; 
import './app/layout/fonts/GT-Eesti-Pro-Display-Regular.woff2';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-widgets/dist/css/react-widgets.css';
import 'semantic-ui-css/semantic.min.css';
import './app/layout/styles.scss';

import * as serviceWorker from './serviceWorker';
import ScrollToTop from './app/layout/ScrollToTop';
import dateFnsLocalizer from 'react-widgets-date-fns';
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import { tr } from "date-fns/locale";
import parse from "date-fns/parse";
import ReactDOMServer from 'react-dom/server';
import App from './app/layout/App';
const locales = {
  "tr": tr
};

dateFnsLocalizer({
  format,
  parse,
  getDay,
  locales
});

export const history = createBrowserHistory();


  ReactDOM.render(
    <Router history={history}>
     <ScrollToTop>
       <App />
     </ScrollToTop>
     </Router>
 , document.getElementById('root'));





// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { localhost } from './constants';

ReactDOM.render(<App localhost={localhost} />, document.getElementById('root'));

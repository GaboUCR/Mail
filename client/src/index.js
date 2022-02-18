import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {EmailContext, EmailProvider} from "./email.context"

ReactDOM.render(
  <React.StrictMode>
    <EmailProvider>
      <App />
    </EmailProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


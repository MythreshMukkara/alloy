/**
 * File: client/src/main.jsx
 * Description: React entry point. Renders the top-level `App` inside a
 * `BrowserRouter` and wraps it with `AuthProviderWrapper` for auth context.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'react-calendar/dist/Calendar.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProviderWrapper } from './context/auth.context'; // Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProviderWrapper>
        <App />
      </AuthProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>,
);
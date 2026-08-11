import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import { AppStateProvider } from './hooks/useAppState';
import './styles/index.css';

document.documentElement.lang = 'ar';
document.documentElement.dir = 'rtl';

const Router = window.location.protocol === 'file:' || window.location.hostname === 'appassets.androidplatform.net'
  ? HashRouter
  : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <MotionConfig reducedMotion="user">
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </MotionConfig>
    </Router>
  </React.StrictMode>,
);

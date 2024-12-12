// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SocketProvider } from './components/Context/SocketContext';
import PrivateChat from './components/PrivateChat';
import { BrowserRouter } from "react-router-dom";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
  <SocketProvider>
      <App />
  </SocketProvider>
  </React.StrictMode>
);

reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Lobby from './lobby/lobby'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Lobby />
  </React.StrictMode>
);

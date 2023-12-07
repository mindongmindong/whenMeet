import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/Global.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap';
document.head.appendChild(link);
root.render(
    <App />
);


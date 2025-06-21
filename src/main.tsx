import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { TourProvider } from '@reactour/tour';
import { steps } from './tourSteps';
import { Analytics } from "@vercel/analytics/react"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <TourProvider 
        steps={steps}
        styles={{
          popover: (base) => ({
            ...base,
            '--reactour-accent': '#8b5cf6',
            borderRadius: '10px',
            backgroundColor: '#1a1a1a',
            color: '#d0d0d0',
            border: '2px solid #8b5cf6',
          }),
          maskArea: (base) => ({ ...base, rx: 10 }),
        }}
      >
        <App />
        <Analytics />
      </TourProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

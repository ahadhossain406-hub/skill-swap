import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { RequestsProvider } from './context/RequestsContext.jsx';
import { SkillsProvider } from './context/SkillsContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <SkillsProvider>
            <RequestsProvider>
              <App />
            </RequestsProvider>
          </SkillsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
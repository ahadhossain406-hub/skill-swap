import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationsProvider } from './context/NotificationsContext.jsx';
import { RequestsProvider } from './context/RequestsContext.jsx';
import { SessionsProvider } from './context/SessionsContext.jsx';
import { SkillsProvider } from './context/SkillsContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <SkillsProvider>
              <NotificationsProvider>
                <RequestsProvider>
                  <SessionsProvider>
                    <App />
                  </SessionsProvider>
                </RequestsProvider>
              </NotificationsProvider>
            </SkillsProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
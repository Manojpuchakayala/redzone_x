import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { DisasterProvider } from './context/DisasterContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("App Crash Caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '650px',
            width: '100%',
            backgroundColor: '#0f172a',
            border: '1px solid #ef4444',
            borderRadius: '1.5rem',
            padding: '2rem',
            textAlign: 'left',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🚨</span>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444', margin: 0 }}>
                Diagnostic Shield: React Runtime Exception
              </h1>
            </div>
            
            <div style={{
              backgroundColor: '#1e293b',
              padding: '1rem',
              borderRadius: '0.75rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              color: '#fca5a5',
              overflowX: 'auto',
              marginBottom: '1rem',
              whiteSpace: 'pre-wrap'
            }}>
              {this.state.error?.toString() || 'Unknown runtime error'}
              {"\n\n"}
              {this.state.error?.stack || ''}
            </div>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/dashboard';
              }}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.4)'
              }}
            >
              🔄 Reset Storage &amp; Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <DisasterProvider>
            <App />
          </DisasterProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

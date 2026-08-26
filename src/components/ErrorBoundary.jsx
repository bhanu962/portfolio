import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Portfolio ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ backgroundColor: '#03050B', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '2rem', color: '#00D2FF', marginBottom: '1rem' }}>SYSTEM NOTICE</h1>
          <p style={{ color: '#94A3B8', maxWidth: '500px', marginBottom: '1.5rem' }}>
            A rendering exception occurred in your browser environment.
          </p>
          <pre style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', color: '#EC4899', fontSize: '0.85rem', maxWidth: '90vw', overflowX: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(to right, #00D2FF, #A855F7)', border: 'none', borderRadius: '9999px', color: '#FFFFFF', fontWeight: 'bold', cursor: 'pointer' }}
          >
            RELOAD INTERFACE
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from 'react';
import NotFound from './NotFound/NotFound';

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
        <NotFound
          customError={this.state.error}
          errorType="500"
          onNavigateHome={() => {
            this.setState({ hasError: false, error: null });
            window.location.href = '/';
          }}
        />
      );
    }

    return this.props.children;
  }
}

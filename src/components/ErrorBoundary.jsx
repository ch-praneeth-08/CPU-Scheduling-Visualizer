import React from 'react';
import '../styles/ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to console for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);

    // Update state with error details
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Optional: You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    // Reset the error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    // Reload the entire page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            {/* Error Icon */}
            <div className="error-icon">
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>

            {/* Error Title */}
            <h1 className="error-title">Oops! Something went wrong</h1>

            {/* Error Message */}
            <p className="error-message">
              We encountered an unexpected error. Don't worry, your data is safe. 
              Please try resetting the application or reload the page.
            </p>

            {/* Action Buttons */}
            <div className="error-actions">
              <button 
                className="error-btn error-btn-primary" 
                onClick={this.handleReset}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Reset Application
              </button>
              
              <button 
                className="error-btn error-btn-secondary" 
                onClick={this.handleReload}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
                </svg>
                Reload Page
              </button>
            </div>

            {/* Error Details (Collapsible) */}
            {this.state.error && (
              <details className="error-details">
                <summary className="error-details-summary">
                  Technical Details (for developers)
                </summary>
                <div className="error-details-content">
                  <div className="error-detail-section">
                    <h3>Error Message:</h3>
                    <pre className="error-code">
                      {this.state.error.toString()}
                    </pre>
                  </div>

                  {this.state.errorInfo && this.state.errorInfo.componentStack && (
                    <div className="error-detail-section">
                      <h3>Component Stack:</h3>
                      <pre className="error-code">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}

                  <div className="error-detail-section">
                    <h3>Error Count:</h3>
                    <p className="error-count-badge">{this.state.errorCount}</p>
                  </div>
                </div>
              </details>
            )}

            {/* Help Text */}
            <div className="error-help">
              <p>
                If this problem persists, please try clearing your browser cache 
                or contact support with the technical details above.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;

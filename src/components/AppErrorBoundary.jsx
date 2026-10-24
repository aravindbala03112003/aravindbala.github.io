import { Component } from 'react';
import { gmailComposeUrl } from '../data/contact';

export default class AppErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) {
    console.error('AppErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className="app-recovery">
          <p className="eyebrow"><span />Portfolio Recovery</p>
          <h1>Something interrupted the experience.</h1>
          <p>Please reload to restore the session. If it persists, contact Aravind directly.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            <button
              className="button button-outline"
              onClick={() => {
                try {
                  sessionStorage.clear();
                  localStorage.clear();
                } catch (_) {}
                window.location.reload();
              }}
            >
              Reload Experience
            </button>
            <a className="button button-primary" href={gmailComposeUrl()} target="_blank" rel="noreferrer">
              Email Aravind
            </a>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}


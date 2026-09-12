import { Component } from 'react';
import { gmailComposeUrl } from '../data/contact';

export default class AppErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) {
    console.error('AppErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) return <main className="app-recovery"><p className="eyebrow"><span />Portfolio</p><h1>Something interrupted the experience.</h1><p>Please refresh the page. If it persists, use the contact link below.</p><a className="button button-primary" href={gmailComposeUrl()} target="_blank" rel="noreferrer">Email Aravind</a></main>;
    return this.props.children;
  }
}

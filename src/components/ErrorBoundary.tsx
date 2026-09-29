import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode; resetKey?: string }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Route error', error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="error-box" role="alert">
        <strong>This page crashed.</strong>
        <p className="muted" style={{ margin: '6px 0 10px' }}>{this.state.error.message}</p>
        <div className="row">
          <button type="button" className="btn" onClick={() => this.setState({ error: null })}>Try again</button>
          <a className="btn" href="#/">Go to dashboard</a>
        </div>
      </div>
    );
  }
}

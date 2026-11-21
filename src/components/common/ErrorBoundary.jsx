import { Component } from 'react';

// Error Boundary ekhono class component diye-i likhte hoy.
// Bhitor-er kono component-e error hole sada screen-er bodole message dekhay.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
          <p className="mt-3 max-w-xl rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={() => window.location.assign('/dashboard')}
            className="mt-6 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Go to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
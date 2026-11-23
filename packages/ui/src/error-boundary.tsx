import React, { Component, PropsWithChildren } from "react";

class ErrorBoundary extends Component<PropsWithChildren> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 rounded bg-red-50">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

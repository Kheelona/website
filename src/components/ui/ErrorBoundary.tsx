"use client";

import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-16">
          <div className="max-w-md w-full text-center flex flex-col gap-6">
            <div className="text-6xl">🔧</div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-600 text-base md:text-lg">
              We encountered an unexpected error. Please try again or contact support if the problem
              persists.
            </p>

            <button
              onClick={this.handleRetry}
              className="mx-auto inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-3 text-white text-lg font-semibold transition-all duration-300 hover:bg-orange-600 hover:-translate-y-0.5"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

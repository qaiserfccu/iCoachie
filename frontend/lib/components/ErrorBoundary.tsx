'use client'

import React, { Component, ReactNode, useState } from 'react'
import { AppError, ERROR_CODES } from '../utils/errorHandling'

interface Props {
  children: ReactNode
  fallback?: React.ComponentType<{ error: AppError; resetError: () => void }>
  onError?: (error: AppError, errorInfo: React.ErrorInfo) => void
}

interface State {
  error: AppError | null
}

const DefaultErrorFallback: React.FC<{ error: AppError; resetError: () => void }> = ({
  error,
  resetError
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error.message}
          </p>
          <div className="mt-6">
            <button
              onClick={resetError}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try again
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reload page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    const appError = error instanceof AppError
      ? error
      : new AppError(ERROR_CODES.UNKNOWN_ERROR, error.message || 'An unexpected error occurred')
    return { error: appError }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError = error instanceof AppError
      ? error
      : new AppError(ERROR_CODES.UNKNOWN_ERROR, error.message || 'An unexpected error occurred')

    console.error('Error Boundary caught an error:', appError, errorInfo)

    if (this.props.onError) {
      this.props.onError(appError, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

// Page-level error boundary
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-red-500">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Something went wrong
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              {error.message}
            </p>
            <button
              onClick={resetError}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

// Component-level error boundary
export const ComponentErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="p-4 border border-red-200 rounded-md bg-red-50">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                Component Error
              </p>
              <p className="text-sm text-red-700">
                {error.message}
              </p>
            </div>
            <button
              onClick={resetError}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

// Async operation error boundary
export const AsyncErrorBoundary: React.FC<{
  children: ReactNode
  loadingComponent?: ReactNode
}> = ({ children, loadingComponent }) => {
  const [isRetrying, setIsRetrying] = React.useState(false)

  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => {
        const handleRetry = async () => {
          setIsRetrying(true)
          try {
            resetError()
            // Add any additional retry logic here
          } finally {
            setIsRetrying(false)
          }
        }

        if (isRetrying && loadingComponent) {
          return <>{loadingComponent}</>
        }

        return (
          <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Operation failed
                </p>
                <p className="text-sm text-yellow-700">
                  {error.message}
                </p>
              </div>
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="text-sm text-yellow-600 hover:text-yellow-800 disabled:opacity-50"
              >
                {isRetrying ? 'Retrying...' : 'Retry'}
              </button>
            </div>
          </div>
        )
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
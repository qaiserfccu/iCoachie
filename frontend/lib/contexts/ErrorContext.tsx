'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { AppError, logError, isAuthError } from '../utils/errorHandling'

interface ErrorContextType {
  error: AppError | null
  setError: (error: AppError | null) => void
  clearError: () => void
  handleError: (error: unknown, context?: string) => void
  showError: (message: string, code?: string) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

interface ErrorProviderProps {
  children: ReactNode
  onAuthError?: () => void
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({
  children,
  onAuthError
}) => {
  const [error, setError] = useState<AppError | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((error: unknown, context?: string) => {
    let appError: AppError

    if (error instanceof AppError) {
      appError = error
    } else if (error instanceof Error) {
      appError = new AppError('UNKNOWN_ERROR', error.message)
    } else {
      appError = new AppError('UNKNOWN_ERROR', 'An unexpected error occurred')
    }

    logError(appError, context)
    setError(appError)

    // Handle authentication errors
    if (isAuthError(appError) && onAuthError) {
      onAuthError()
    }
  }, [onAuthError])

  const showError = useCallback((message: string, code = 'CUSTOM_ERROR') => {
    const appError = new AppError(code as any, message)
    setError(appError)
  }, [])

  const value: ErrorContextType = {
    error,
    setError,
    clearError,
    handleError,
    showError
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  )
}

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}

// Error display component
interface ErrorDisplayProps {
  error: AppError
  onClose?: () => void
  className?: string
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onClose,
  className = ''
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message}</p>
            {error.validationErrors && error.validationErrors.length > 0 && (
              <ul className="mt-2 list-disc list-inside">
                {error.validationErrors.map((validationError, index) => (
                  <li key={index}>
                    <strong>{validationError.field}:</strong> {validationError.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Global error display component
export const GlobalErrorDisplay: React.FC = () => {
  const { error, clearError } = useError()

  if (!error) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <ErrorDisplay
        error={error}
        onClose={clearError}
        className="shadow-lg"
      />
    </div>
  )
}
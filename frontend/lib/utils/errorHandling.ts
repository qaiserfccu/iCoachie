import React from 'react'
import { AxiosError } from 'axios'

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

export interface ValidationError {
  field: string
  message: string
}

export interface ApiErrorResponse {
  message: string
  code?: string
  errors?: ValidationError[]
  details?: any
}

// Error codes
export const ERROR_CODES = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',

  // Business logic errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',

  // Server errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  // Client errors
  INVALID_REQUEST: 'INVALID_REQUEST',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

// Error class
export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly details?: any
  public readonly timestamp: Date
  public readonly validationErrors?: ValidationError[]

  constructor(code: ErrorCode, message: string, details?: any, validationErrors?: ValidationError[]) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
    this.timestamp = new Date()
    this.validationErrors = validationErrors
  }
}

// Error parsing utilities
export const parseApiError = (error: AxiosError): AppError => {
  if (!error.response) {
    // Network error
    if (error.code === 'ECONNABORTED') {
      return new AppError(ERROR_CODES.TIMEOUT, 'Request timed out. Please try again.')
    }
    return new AppError(ERROR_CODES.NETWORK_ERROR, 'Network error. Please check your connection.')
  }

  const status = error.response.status
  const data = error.response.data as ApiErrorResponse

  switch (status) {
    case 400:
      return new AppError(
        ERROR_CODES.INVALID_REQUEST,
        data.message || 'Invalid request',
        data.details,
        data.errors
      )

    case 401:
      return new AppError(
        ERROR_CODES.UNAUTHORIZED,
        data.message || 'Authentication required'
      )

    case 403:
      return new AppError(
        ERROR_CODES.FORBIDDEN,
        data.message || 'Access denied'
      )

    case 404:
      return new AppError(
        ERROR_CODES.NOT_FOUND,
        data.message || 'Resource not found'
      )

    case 409:
      return new AppError(
        ERROR_CODES.ALREADY_EXISTS,
        data.message || 'Resource already exists'
      )

    case 422:
      return new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        data.message || 'Validation failed',
        data.details,
        data.errors
      )

    case 500:
      return new AppError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'Internal server error. Please try again later.'
      )

    case 503:
      return new AppError(
        ERROR_CODES.SERVICE_UNAVAILABLE,
        'Service temporarily unavailable. Please try again later.'
      )

    default:
      return new AppError(
        ERROR_CODES.UNKNOWN_ERROR,
        data.message || 'An unexpected error occurred'
      )
  }
}

// Error handling utilities
export const isValidationError = (error: AppError): boolean => {
  return error.code === ERROR_CODES.VALIDATION_ERROR
}

export const isAuthError = (error: AppError): boolean => {
  return [ERROR_CODES.UNAUTHORIZED, ERROR_CODES.FORBIDDEN, ERROR_CODES.TOKEN_EXPIRED].includes(error.code)
}

export const isNetworkError = (error: AppError): boolean => {
  return [ERROR_CODES.NETWORK_ERROR, ERROR_CODES.TIMEOUT].includes(error.code)
}

export const isServerError = (error: AppError): boolean => {
  return [ERROR_CODES.INTERNAL_SERVER_ERROR, ERROR_CODES.SERVICE_UNAVAILABLE].includes(error.code)
}

// Error message formatting
export const formatValidationErrors = (errors: ValidationError[]): string => {
  return errors.map(err => `${err.field}: ${err.message}`).join('\n')
}

export const getErrorMessage = (error: AppError): string => {
  if (isValidationError(error) && error.validationErrors) {
    return formatValidationErrors(error.validationErrors)
  }
  return error.message
}

// Error logging
export const logError = (error: AppError, context?: string): void => {
  const logData = {
    code: error.code,
    message: error.message,
    details: error.details,
    timestamp: error.timestamp,
    context,
    stack: error.stack
  }

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('App Error:', logData)
  }

  // In production, you might want to send to error reporting service
  // Example: Sentry, LogRocket, etc.
}

// Error boundary helper
export const createErrorBoundary = (fallback: React.ComponentType<{ error: AppError; resetError: () => void }>) => {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { error: AppError | null }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props)
      this.state = { error: null }
    }

    static getDerivedStateFromError(error: Error): { error: AppError } {
      const appError = error instanceof AppError
        ? error
        : new AppError(ERROR_CODES.UNKNOWN_ERROR, error.message)
      return { error: appError }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      logError(
        error instanceof AppError
          ? error
          : new AppError(ERROR_CODES.UNKNOWN_ERROR, error.message),
        'React Error Boundary'
      )
    }

    resetError = () => {
      this.setState({ error: null })
    }

    render() {
      if (this.state.error) {
        return React.createElement(fallback, {
          error: this.state.error,
          resetError: this.resetError
        })
      }

      return this.props.children
    }
  }
}
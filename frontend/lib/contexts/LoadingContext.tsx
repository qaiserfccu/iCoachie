'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface LoadingState {
  id: string
  message?: string
}

interface LoadingContextType {
  loadingStates: LoadingState[]
  isLoading: (id: string) => boolean
  startLoading: (id: string, message?: string) => void
  stopLoading: (id: string) => void
  clearAllLoading: () => void
  globalLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

interface LoadingProviderProps {
  children: ReactNode
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([])

  const isLoading = useCallback((id: string) => {
    return loadingStates.some(state => state.id === id)
  }, [loadingStates])

  const startLoading = useCallback((id: string, message?: string) => {
    setLoadingStates(prev => {
      // Remove existing state with same id
      const filtered = prev.filter(state => state.id !== id)
      return [...filtered, { id, message }]
    })
  }, [])

  const stopLoading = useCallback((id: string) => {
    setLoadingStates(prev => prev.filter(state => state.id !== id))
  }, [])

  const clearAllLoading = useCallback(() => {
    setLoadingStates([])
  }, [])

  const globalLoading = loadingStates.length > 0

  const value: LoadingContextType = {
    loadingStates,
    isLoading,
    startLoading,
    stopLoading,
    clearAllLoading,
    globalLoading
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

// Loading spinner component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`} />
  )
}

// Loading overlay component
interface LoadingOverlayProps {
  message?: string
  className?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message,
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-gray-700 text-center">{message}</p>
        )}
      </div>
    </div>
  )
}

// Global loading display
export const GlobalLoadingDisplay: React.FC = () => {
  const { loadingStates } = useLoading()

  if (loadingStates.length === 0) return null

  // Show overlay for global loading states
  const globalStates = loadingStates.filter(state =>
    state.id.startsWith('global-') || state.id.startsWith('auth-')
  )

  if (globalStates.length > 0) {
    const message = globalStates[0].message || 'Loading...'
    return <LoadingOverlay message={message} />
  }

  return null
}

// Hook for managing loading state in components
export const useLoadingState = (id: string, initialMessage?: string) => {
  const { isLoading, startLoading, stopLoading } = useLoading()

  const setLoading = useCallback((loading: boolean, message?: string) => {
    if (loading) {
      startLoading(id, message || initialMessage)
    } else {
      stopLoading(id)
    }
  }, [id, initialMessage, startLoading, stopLoading])

  return {
    isLoading: isLoading(id),
    setLoading
  }
}
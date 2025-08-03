'use client'
import { AnimatePresence } from 'framer-motion'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { Toast } from './Toast'

interface ToastAction {
  label: string
  onClick: () => void
  buttonClassName?: string
}

interface ToastOptions {
  className?: string
  containerClassName?: string
  message: string
  description?: string
  messageClassName?: string
  messageAreaClassName?: string
  descriptionClassName?: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  action?: ToastAction
  id?: string
}

interface ToastItem extends ToastOptions {
  id: string
  isNew: boolean
  timestamp: number
}

interface ToastContextType {
  toast: (options: ToastOptions) => void
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string
      loadingDescription?: string
      success: string
      successDescription?: string
      error: string
      errorDescription?: string
    }
  ) => Promise<T>
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((options: ToastOptions) => {
    const id =
      options.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: ToastItem = {
      ...options,
      id,
      isNew: true,
      timestamp: Date.now()
    }

    setToasts(prev => {
      const updatedPrev = prev.map(toast => ({ ...toast, isNew: false }))
      return [newToast, ...updatedPrev]
    })

    setTimeout(() => {
      setToasts(prev => prev.map(t => (t.id === id ? { ...t, isNew: false } : t)))
    }, 300)

    if (options.duration && options.duration !== Infinity) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, options.duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const promise = useCallback(
    async <T,>(
      p: Promise<T>,
      options: {
        loading: string
        loadingDescription?: string
        success: string
        successDescription?: string
        error: string
        errorDescription?: string
      }
    ): Promise<T> => {
      const loadingId = `loading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      toast({
        id: loadingId,
        message: options.loading,
        description: options.loadingDescription,
        type: 'info',
        duration: Infinity
      })

      try {
        const result = await p
        setToasts(prev => prev.filter(t => t.id !== loadingId))
        toast({
          message: options.success,
          description: options.successDescription,
          type: 'success'
        })
        return result
      } catch (e) {
        setToasts(prev => prev.filter(t => t.id !== loadingId))
        toast({
          message: options.error,
          description: options.errorDescription,
          type: 'error'
        })
        throw e
      }
    },
    [toast]
  )

  return (
    <ToastContext.Provider value={{ toast, promise }}>
      {children}
      <div className='fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-2'>
        <AnimatePresence>
          {toasts.slice(0, 5).map(toastItem => (
            <Toast
              key={toastItem.id}
              toastId={toastItem.id}
              {...toastItem}
              onClose={() => removeToast(toastItem.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
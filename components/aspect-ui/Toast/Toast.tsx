'use client'
import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { cn } from '../../utils/cn'

interface ToastAction {
  label: string
  onClick: () => void
  buttonClassName?: string
}


interface ToastProps {
  className?: string
  containerClassName?: string
  message: string
  description?: string
  messageClassName?: string
  messageAreaClassName?: string
  descriptionClassName?: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose?: () => void
  action?: ToastAction
  isNew?: boolean
  toastId: string
}
export const Toast: React.FC<ToastProps> = ({
  className = '',
  containerClassName = '',
  message,
  description,
  messageClassName = '',
  messageAreaClassName = '',
  descriptionClassName = '',
  type = 'info',
  duration = 3000,
  onClose,
  action,
  isNew = false,
  toastId
}) => {
  useEffect(() => {
    if (duration === Infinity) return

    const timer = setTimeout(() => {
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    if (onClose) onClose()
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success text-success-foreground'
      case 'error':
        return 'bg-error text-error-foreground'
      case 'warning':
        return 'bg-warning text-warning-foreground'
      default:
        return 'bg-bg text-text'
    }
  }

  return (
    <motion.div
      layoutId={toastId}
      layout
      initial={
        isNew
          ? {
            opacity: 0,
            x: 300, // Only new toasts slide in from right
            scale: 0.9
          }
          : false
      } // Existing toasts don't get initial animation
      animate={{
        opacity: 1,
        x: 0,
        scale: 1
      }}
      exit={{
        opacity: 0,
        x: 300, // Only removed toast slides out to right
        scale: 0.9
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
        layout: { duration: 0.2, ease: 'easeInOut' }
      }}
      className={cn(
        'w-[280px] rounded-md shadow-lg transition-colors',
        getBackgroundColor(),
        className
      )}
    >
      <div
        className={cn(
          'flex items-start justify-between p-4',
          containerClassName
        )}
      >
        <div className={messageAreaClassName}>
          <div className={cn('font-medium', messageClassName)}>{message}</div>
          {description && (
            <div
              className={cn(
                'text-text-muted mt-1 text-sm',
                descriptionClassName
              )}
            >
              {description}
            </div>
          )}
        </div>
        {action ? (
          <button
            onClick={action.onClick}
            className={cn(
              'ml-4 rounded-md px-2 py-1 text-sm font-medium',
              action.buttonClassName
            )}
          >
            {action.label}
          </button>
        ) : (
          <button
            onClick={handleClose}
            className='ml-4 text-lg font-bold opacity-60 hover:opacity-100'
            aria-label='Close'
          >
            &times;
          </button>
        )}
      </div>
    </motion.div>
  )
}
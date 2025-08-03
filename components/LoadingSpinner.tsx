import React from 'react'
import { Spinner } from './aspect-ui'

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin mx-auto mb-4">
          <Spinner size="large" />
        </div>
        <p className="text-text">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
import LoadingSpinner from '@/components/LoadingSpinner'
import { Suspense } from 'react'
import Track from './Track'

const page = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Track />
    </Suspense>
  )
}

export default page
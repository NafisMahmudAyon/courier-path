'use client'
import AgentRegister from '@/components/AgentRegister'
import CustomerRegister from '@/components/CustomerRegister'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const Register = () => {
  const searchParams = useSearchParams()
  const role = searchParams.get('role')
  return (
    <div className=' bg-gradient'>
      {role === 'agent' ? <AgentRegister /> : <CustomerRegister />}
    </div>
  )
}

const page = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Register />
    </Suspense>
  )
}

export default page
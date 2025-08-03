'use client'

import AdminDashboard from '@/components/AdminDashboard'
import AgentDashboard from '@/components/AgentDashboard'
import CustomerDashboard from '@/components/CustomerDashboard'
import { useAuth } from '@/context/AuthContext'
import React from 'react'

const Dashboard = () => {
  const {user} = useAuth()
  const role = user?.role ?? 'customer'
  return (
    <div className='bg-gradient'>
      {role === 'agent' ? <AgentDashboard /> : role === 'customer' ? <CustomerDashboard /> : <AdminDashboard />}
    </div>
  )
}

export default Dashboard
'use client'
import React from 'react'
import { Button } from './aspect-ui'
import { Package, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CustomerSection = () => {
  const router = useRouter()
  return (
    <section className="py-20 bg-bg">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-primary mb-6">For Customers</h2>
            <p className="text-lg mb-8">
              Sign up or log in to book pickups, manage deliveries, and track parcels.
              Experience the convenience of professional courier services at your fingertips.
            </p>
            <div className="flex flex-wrap sm:flex-row gap-4">
              <Button
                size="large"
                variant='primary'
                icon={<Users />}
                onClick={()=>{router.push('/register')}}
              >
                Register as Customer
              </Button>
              <Button
                size="large"
                variant="outline"
                onClick={()=>{router.push('/login')}}
              >
                Customer Login
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-3xl p-8 shadow-2xl">
            <div className="rounded-2xl p-6  z-10">
              <Package className="w-16 h-16 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Customer Dashboard</h3>
              <p className="text-white/80">Track, manage, and schedule all your deliveries in one place.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomerSection
'use client'
import React from 'react'
import { Button } from './aspect-ui'
import { Truck, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

const AgentSection = () => {
  const router = useRouter()
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="bg-gradient-to-br from-lime-500 to-teal-600 rounded-3xl p-8 shadow-2xl">
            <div className="rounded-2xl p-6  z-10">
              <Truck className="w-16 h-16 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Agent Portal</h3>
              <p className="text-white/80">Manage your deliveries, earnings, and schedule with our mobile-friendly platform.</p>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-primary mb-6">Join as a Delivery Agent</h2>
            <p className="text-lg mb-8">
              Become part of our growing network. Enjoy flexible hours, competitive rates,
              and timely payouts. Start earning with Courier Path today.
            </p>
            <div className="flex flex-wrap sm:flex-row gap-4">
              <Button
                size="large"
                variant='primary'
                icon={<Users />}
                onClick={()=>{router.push('/register?role=agent')}}
              >
                Register as Agent
              </Button>
              <Button
                size="large"
                variant="outline"
                onClick={()=>{router.push('/login')}}
              >
                Agent Login
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}

export default AgentSection
'use client'
import { Search } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button, Input } from './aspect-ui'

const HeroSection = () => {
  const [trackingId, setTrackingId] = useState('');
  return (
    <div className='min-h-screen flex flex-col w-full items-center justify-center'>
      <h1 className='text-display-1 text-primary'>Courier Path</h1>
      <h2 className="text-text text-h4">Tracking your parcel made easy</h2>
      <div className="flex items-center gap-4 mt-6">

        <div className="flex-1">

          <div className="relative">
            <Input
              type="text"
              id="trackingId"
              label='Tracking ID'
              labelClassName='sr-only'
              wrapperClassName='mb-0'
              icon={<Search />}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTrackingId(e.target.value)}
              className=""
              placeholder="Enter tracking ID (e.g., CMS1234567890)"
            />
          </div>
        </div>
        <Button
          type="submit"
          variant='primary'
          className=""
        >
          <Link href={`/track?trackingId=${trackingId}`}>
            Track
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default HeroSection
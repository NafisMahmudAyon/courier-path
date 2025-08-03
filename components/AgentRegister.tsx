'use client'
import { useAuth } from '@/context/AuthContext';
import { Lock, Map, Package, Phone, TextCursorInput, Truck, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from './aspect-ui';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  agentDetails?: {
    vehicleType: string;
    licenseNumber: string;
  };
}

const AgentRegister = () => {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await registerUser({ ...data });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient py-12 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Package className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-primary">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="hidden"
            value="agent"
            {...register('role')}
          />

          <Input
            {...register('name', { required: 'Name is required' })}
            type="text"
            label='Name'
            icon={<User />}
            placeholder="Full name"
            error={
              errors.name && errors.name.message

            }
          />


          <Input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            label='Email'
            placeholder="Email address"
            error={
              errors.email && errors.email.message

            }
          />


          <Input
            {...register('phone', { required: 'Phone number is required' })}
            type="tel"
            label='Phone'
            icon={<Phone />}
            placeholder="Phone number"
            error={
              errors.phone && errors.phone.message
            }
          />


          <Input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            type="password"
            label='Password'
            icon={<Lock />}
            placeholder="Password"
            error={
              errors.password && errors.password.message
            }
          />

          <div className="space-y-3">
            <label className="block text-lg font-medium text-text">
              Address
            </label>
            <Input
              {...register('address.street', { required: 'Street address is required' })}
              type="text"
              label='Street'
              icon={<Map />}
              placeholder="Street address"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                {...register('address.city', { required: 'City is required' })}
                type="text"
                label='City'
                icon={<Map />}
                placeholder="City"
              />
              <Input
                {...register('address.state', { required: 'State is required' })}
                type="text"
                label="State"
                icon={<Map />}
                placeholder="State"
              />
            </div>
            <Input
              {...register('address.zipCode', { required: 'ZIP code is required' })}
              type="text"
              label='ZIP Code'
              icon={<Map />}
              placeholder="ZIP Code"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-lg font-medium text-text">
              Agent Details
            </label>
            <fieldset className={'mb-4'}>
              <label
                className={'text-text mb-1 block text-sm font-medium'}
              >
                Vehicle Type
              </label>
              <div className='relative'>
                <div
                  className={'text-text pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4'
                  }
                >
                  <Truck />
                </div>
                <select
                  {...register('agentDetails.vehicleType', { required: 'Vehicle type is required' })}
                  className="placeholder:text-text-muted shadow-xs selection:bg-primary selection:text-primary-foreground focus-visible:border-border focus:outline-hidden focus:ring-border w-full rounded-md border px-3 py-2 ps-11 focus:ring-2 border-border aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                >
                  <option value="">Select vehicle type</option>
                  <option value="bike">Bike</option>
                  <option value="van">Van</option>
                  <option value="truck">Truck</option>
                </select>
              </div>
            </fieldset>
            <Input
              {...register('agentDetails.licenseNumber', { required: 'License number is required' })}
              type="text"
              icon={<TextCursorInput />}
              label='License Number'
              placeholder="License number"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            variant='primary'
            className='w-full'
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AgentRegister
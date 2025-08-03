'use client'

import { Button, Input } from '@/components/aspect-ui'
import { useAuth } from '@/context/AuthContext'
import { Lock, Package } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface LoginForm {
  email: string;
  password: string;
}
const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Package className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-primary">
            Login your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type="password"
              label='Password'
              placeholder="Password"
              icon={<Lock />}
              error={
                errors.password && errors.password.message
              }
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            variant='primary'
            className='w-full'
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
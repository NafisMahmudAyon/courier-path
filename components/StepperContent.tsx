'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Package, MapPin, DollarSign, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, Stepper, StepperItem, useStepper, useToast } from '@/components/aspect-ui';

interface BookingFormData {
  pickupAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    contactName: string;
    contactPhone: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    contactName: string;
    contactPhone: string;
  };
  parcelDetails: {
    weight: number;
    type: string;
    description: string;
    value: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  payment: {
    type: string;
    amount: number;
  };
  priority: string;
  specialInstructions: string;
}


const StepperContent = () => {
  const { user } = useAuth();
  const router = useRouter()
  const { toast } = useToast()
  const { activeStep, setActiveStep, totalSteps } = useStepper()
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>();

  const watchedWeight = watch('parcelDetails.weight');
  const watchedType = watch('parcelDetails.type');
  const watchedPaymentType = watch('payment.type');

  // Calculate pricing based on weight and type
  React.useEffect(() => {
    if (watchedWeight && watchedType) {



      const finalPrice = 110;

      setValue('payment.amount', Math.round(finalPrice * 100) / 100);
    }
  }, [watchedWeight, watchedType, setValue]);

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    try {
      // Mock coordinates for demo (in real app, use geocoding API)
      const mockCoordinates = {
        pickup: { lat: 40.7128, lng: -74.0060 },
        delivery: { lat: 40.7589, lng: -73.9851 }
      };

      const bookingData = {
        ...data,
        trackingId: 'CMS' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase(),
        pickupAddress: {
          ...data.pickupAddress,
          coordinates: mockCoordinates.pickup
        },
        deliveryAddress: {
          ...data.deliveryAddress,
          coordinates: mockCoordinates.delivery
        }
      };

      const token = localStorage.getItem('token');
      const response = await fetch('https://socket-server-cjq4.onrender.com/api/parcels/book', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          message: 'Parcel booked successfully!',
          type: 'success',
          duration: 3000
        })
        router.push('/dashboard');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        message: 'Failed to book parcel',
        type: 'error',
        duration: 3000
      })
    } finally {
      setIsLoading(false);
    }
  };
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-500" />
                Pickup Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input
                    {...register('pickupAddress.street', { required: 'Street address is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Street address"
                  />
                  {errors.pickupAddress?.street && (
                    <p className="mt-1 text-sm text-red-600">{errors.pickupAddress.street.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('pickupAddress.city', { required: 'City is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                  />
                  {errors.pickupAddress?.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.pickupAddress.city.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('pickupAddress.state', { required: 'State is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="State"
                  />
                  {errors.pickupAddress?.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.pickupAddress.state.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('pickupAddress.zipCode', { required: 'ZIP code is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ZIP Code"
                  />
                  {errors.pickupAddress?.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.pickupAddress.zipCode.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('pickupAddress.contactName')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contact name (optional)"
                  />
                </div>
                <div>
                  <input
                    {...register('pickupAddress.contactPhone')}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contact phone (optional)"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-red-500" />
                Delivery Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input
                    {...register('deliveryAddress.street', { required: 'Street address is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Street address"
                  />
                  {errors.deliveryAddress?.street && (
                    <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.street.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('deliveryAddress.city', { required: 'City is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                  />
                  {errors.deliveryAddress?.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.city.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('deliveryAddress.state', { required: 'State is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="State"
                  />
                  {errors.deliveryAddress?.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.state.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('deliveryAddress.zipCode', { required: 'ZIP code is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ZIP Code"
                  />
                  {errors.deliveryAddress?.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.zipCode.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('deliveryAddress.contactName')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contact name (optional)"
                  />
                </div>
                <div>
                  <input
                    {...register('deliveryAddress.contactPhone')}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contact phone (optional)"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-500" />
                Parcel Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg) *
                  </label>
                  <input
                    {...register('parcelDetails.weight', {
                      required: 'Weight is required',
                      min: { value: 0.1, message: 'Weight must be at least 0.1 kg' }
                    })}
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                  />
                  {errors.parcelDetails?.weight && (
                    <p className="mt-1 text-sm text-red-600">{errors.parcelDetails.weight.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    {...register('parcelDetails.type', { required: 'Type is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="document">Document</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="food">Food</option>
                    <option value="fragile">Fragile</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.parcelDetails?.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.parcelDetails.type.message}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register('parcelDetails.description')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the parcel contents"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Declared Value ($)
                  </label>
                  <input
                    {...register('parcelDetails.value')}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    {...register('priority')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="medium">Standard</option>
                    <option value="high">Express</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2 mt-4">
                  Dimensions (cm) - Optional
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input
                      {...register('parcelDetails.dimensions.length')}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Length"
                    />
                  </div>
                  <div>
                    <input
                      {...register('parcelDetails.dimensions.width')}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Width"
                    />
                  </div>
                  <div>
                    <input
                      {...register('parcelDetails.dimensions.height')}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Height"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  {...register('specialInstructions')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special handling instructions"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Type *
                  </label>
                  <select
                    {...register('payment.type', { required: 'Payment type is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select payment type</option>
                    <option value="prepaid">Prepaid</option>
                    <option value="cod">Cash on Delivery (COD)</option>
                  </select>
                  {errors.payment?.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.payment.type.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount ($)
                  </label>
                  <input
                    {...register('payment.amount', { required: 'Amount is required' })}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"

                  />
                  {errors.payment?.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.payment.amount.message}</p>
                  )}
                </div>
              </div>

              {watchedPaymentType === 'cod' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Cash on Delivery Selected
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          The recipient will pay ${watch('payment.amount')} in cash upon delivery.
                          Please ensure the recipient is available and has the exact amount ready.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-4">
          {renderStep()}
        </Card>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
            className={`px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${activeStep === 0 ? 'invisible' : ''
              }`}
          >
            Previous
          </button>

          {activeStep < totalSteps - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep(activeStep + 1)}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Booking...' : 'Book Parcel'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default StepperContent
'use client'
import { Button, Card, Divider, Input, Textarea, useToast } from '@/components/aspect-ui';
import { useAuth } from '@/context/AuthContext';
import { Box, Building, DollarSign, MapMinus, MapPin, MapPinHouse, Package, Phone, Ruler, RulerDimensionLine, User, Weight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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
  };
  priority: string;
  specialInstructions: string;
}

export default function BookingForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>();
  const [token, setToken] = useState("")

  useEffect(() => {
    if (typeof window !== 'undefined') {
    const tokenData = localStorage.getItem('token');
    if (tokenData) {
      setToken(token);
    }
  }
  }, []);


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
    } catch (error: any) {
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
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-text mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-500" />
                Pickup Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    {...register('pickupAddress.street', { required: 'Street address is required' })}
                    type="text"
                    label='Street'
                    icon={<MapPinHouse />}
                    placeholder="Street address"
                    error={errors.pickupAddress?.street && errors.pickupAddress.street.message}
                  />
                </div>
                <div>
                  <Input
                    {...register('pickupAddress.city', { required: 'City is required' })}
                    type="text"
                    label='City'
                    icon={<Building />}
                    placeholder="City"
                    error={errors.pickupAddress?.city && errors.pickupAddress.city.message}
                  />
                </div>
                <div>
                  <Input
                    {...register('pickupAddress.state', { required: 'State is required' })}
                    type="text"
                    label='State'
                    icon={<MapMinus />}
                    placeholder="State"
                    error={errors.pickupAddress?.state && errors.pickupAddress.state.message}
                  />
                </div>
                <div>
                  <Input
                    {...register('pickupAddress.zipCode', { required: 'ZIP code is required' })}
                    type="text"
                    label='ZIP Code'
                    icon={<MapPin />}
                    placeholder="ZIP Code"
                    error={errors.pickupAddress?.zipCode && errors.pickupAddress.zipCode.message}
                  />
                </div>
                <div>
                  <Input
                    {...register('pickupAddress.contactName')}
                    type="text"
                    label='Contact Name'
                    icon={<User />}
                    placeholder="Contact name (optional)"
                  />
                </div>
                <div>
                  <Input
                    {...register('pickupAddress.contactPhone')}
                    type="tel"
                    label='Contact Phone'
                    icon={<Phone />}
                    placeholder="Contact phone (optional)"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-text mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-red-500" />
                Delivery Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    {...register('deliveryAddress.street', { required: 'Street address is required' })}
                    type="text"
                    label='Street'
                    icon={<MapPinHouse />}
                    placeholder="Street address"
                    error={errors.deliveryAddress?.street && errors.deliveryAddress.street.message}
                  />
                </div>
                <div>
                  <Input
                    {...register('deliveryAddress.city', { required: 'City is required' })}
                    type="text"
                    label='City'
                    icon={<Building />}
                    placeholder="City"
                    error={errors.pickupAddress?.city && errors.pickupAddress.city.message}
                  />
                </div>
                <div>
                  <Input
                    {...register('deliveryAddress.state', { required: 'State is required' })}
                    type="text"
                    label='State'
                    icon={<MapMinus />}
                    placeholder="State"
                    error={errors.deliveryAddress?.state && errors.deliveryAddress.state.message}
                  />
                </div>
                <div>
                  <Input
                    {...register('deliveryAddress.zipCode', { required: 'ZIP code is required' })}
                    type="text"
                    label='ZIP Code'
                    icon={<MapPin />}
                    placeholder="ZIP Code"
                    error={errors.deliveryAddress?.zipCode && errors.deliveryAddress.zipCode.message}
                  />
                </div>
                <div>
                  <Input
                    {...register('deliveryAddress.contactName')}
                    type="text"
                    label='Contact Name'
                    icon={<User />}
                    placeholder="Contact name (optional)"
                  />
                </div>
                <div>
                  <Input
                    {...register('deliveryAddress.contactPhone')}
                    type="tel"
                    label='Contact Phone'
                    icon={<Phone />}
                    placeholder="Contact phone (optional)"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-500" />
                Parcel Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    {...register('parcelDetails.weight', {
                      required: 'Weight is required',
                      min: { value: 0.1, message: 'Weight must be at least 0.1 kg' }
                    })}
                    type="number"
                    step="0.1"
                    label='Weight (kg) *'
                    icon={<Weight />}
                    placeholder="0.0"
                    error={errors.parcelDetails?.weight && errors.parcelDetails.weight.message}
                  />
                </div>
                <fieldset className='mb-4'>
                  <label className="text-text mb-1 block text-sm font-medium">
                    Type *
                  </label>
                  <div className='relative'>
                    <div
                      className={
                        'text-text pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4'}
                    >
                      <Package />
                    </div>
                    <select
                      {...register('parcelDetails.type', { required: 'Type is required' })}
                      className="placeholder:text-text-muted shadow-xs selection:bg-primary selection:text-primary-foreground focus-visible:border-border border-border focus:outline-hidden focus:ring-border w-full rounded-md border px-3 py-2 ps-11 focus:ring-2"
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
                      <p
                        className={'text-error-foreground mt-1 text-sm'}
                      >
                        {errors.parcelDetails.type.message}
                      </p>
                    )}
                  </div>
                </fieldset>
                <div className="md:col-span-2">
                  <Textarea
                    {...register('parcelDetails.description')}
                    rows={3}
                    label='Description'
                    placeholder="Brief description of the parcel contents"
                  />
                </div>
                <div>
                  <Input
                    {...register('parcelDetails.value')}
                    type="number"
                    step="0.01"
                    label='Declared Value ($)'
                    icon={<DollarSign />}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-text mb-1 block text-sm font-medium">
                    Priority
                  </label>
                  <select
                    {...register('priority')}
                    className="placeholder:text-text-muted shadow-xs selection:bg-primary selection:text-primary-foreground focus-visible:border-border border-border focus:outline-hidden focus:ring-border w-full rounded-md border px-3 py-2  focus:ring-2"
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
                    <Input
                      {...register('parcelDetails.dimensions.length')}
                      type="number"
                      icon={<Ruler />}
                      placeholder="Length"
                    />
                  </div>
                  <div>
                    <Input
                      {...register('parcelDetails.dimensions.width')}
                      type="number"
                      icon={<RulerDimensionLine />}
                      placeholder="Width"
                    />
                  </div>
                  <div>
                    <Input
                      {...register('parcelDetails.dimensions.height')}
                      type="number"
                      icon={<RulerDimensionLine className='rotate-90' />}
                      placeholder="Height"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Textarea
                  {...register('specialInstructions')}
                  rows={2}
                  label='Special Instructions'
                  placeholder="Any special handling instructions"
                />
              </div>
            </div>
          </div>
        );

      case 3:
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
                    className="placeholder:text-text-muted shadow-xs selection:bg-primary selection:text-primary-foreground focus-visible:border-border border-border focus:outline-hidden focus:ring-border w-full rounded-md border px-3 py-2  focus:ring-2"
                  >
                    <option value="">Select payment type</option>
                    <option value="prepaid">Prepaid</option>
                    <option value="cod">Cash on Delivery (COD)</option>
                  </select>

                  {errors.payment?.type && (
                    <p
                      className={'text-error-foreground mt-1 text-sm'}
                    >
                      {errors.payment.type.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Book a Parcel</h1>
        <p className="mt-1 text-sm">
          Fill in the details to schedule your parcel pickup and delivery
        </p>
      </div>

      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center gap-4 ">
            {[
              { id: 1, name: 'Addresses', icon: MapPin },
              { id: 2, name: 'Parcel Details', icon: Box },
              { id: 3, name: 'Payment', icon: DollarSign }
            ].map((stepItem, index) => (
              <React.Fragment key={stepItem.id}>
                <li key={stepItem.id} className={`${index !== 2 ? '' : ''} relative`}>
                  <div className="flex flex-1 items-center">
                    <div className={`flex flex-1 items-center justify-center !w-10 h-10 rounded-full border-2 ${step >= stepItem.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border'
                      }`}>
                      <stepItem.icon className="w-5 h-5" />
                    </div>
                    <span className={`ml-2 text-sm font-medium whitespace-nowrap ${step >= stepItem.id ? 'text-primary' : ''
                      }`}>
                      {stepItem.name}
                    </span>
                  </div>
                </li>
                {index !== 2 && (
                  <Divider className={step > stepItem.id ? 'border-t-primary' : 'border-t-border'} />
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6 mb-6">
          {renderStep()}
        </Card>
        <div className="flex justify-between">
          <Button
            type="button"
            variant='default'
            onClick={() => step > 1 && setStep(step - 1)}
            className={`${step === 1 ? 'invisible' : ''
              }`}
          >
            Previous
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              variant='default'
              onClick={() => setStep(step + 1)}
              className=""
            >
              Next
            </Button>
          ) : (
            <Button
              variant='primary'
              type="submit"
              disabled={isLoading}
              className=""
            >
              {isLoading ? 'Booking...' : 'Book Parcel'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
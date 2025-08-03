'use client'
import { Alert, Badge, Button, Card, Divider, Input, ProgressBar, Timeline, TimelineItem } from '@/components/aspect-ui';
import { AlertCircle, CheckCircle, Clock, MapPin, Package, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { format } from 'date-fns';

interface TrackingResult {
  trackingId: string;
  status: string;
  pickupAddress: any;
  deliveryAddress: any;
  parcelDetails: any;
  payment: any;
  customer: any;
  agent?: any;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    notes?: string;
    location?: { lat: number; lng: number };
    updatedBy: any;
  }>;
  createdAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

const Track = () => {
  const searchParams = useSearchParams()
  const urlTrackingId = searchParams.get('trackingId')
  const [trackingId, setTrackingId] = useState(urlTrackingId || '');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`https://socket-server-cjq4.onrender.com/api/track/${trackingId}`);
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Parcel not found');
      }
    } catch (err) {
      setError('Failed to track parcel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-track if URL has tracking ID
  React.useEffect(() => {
    if (urlTrackingId && !result) {
      handleTrack();
    }
  }, [urlTrackingId]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      assigned: 'text-blue-600 bg-blue-100',
      picked_up: 'text-indigo-600 bg-indigo-100',
      in_transit: 'text-purple-600 bg-purple-100',
      out_for_delivery: 'text-orange-600 bg-orange-100',
      delivered: 'text-green-600 bg-green-100',
      failed: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getProgressPercentage = (status: string) => {
    const statusOrder = ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-gradient">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Package className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl font-bold text-primary">Track Your Package</h1>
          <p className="mt-2 text-text-muted">
            Enter your tracking ID to get real-time updates on your parcel
          </p>
        </div>
        <div className="">
          <form onSubmit={handleTrack} className="flex space-x-4 items-center">
            <div className="flex-1">
              
              <div className="relative">
                <Input
                  type="text"
                  id="trackingId"
                  value={trackingId}
                  label='Tracking ID'
                  labelClassName='sr-only'
                  wrapperClassName='mb-0'
                  icon={<Search />}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className=""
                  placeholder="Enter tracking ID (e.g., CMS1234567890)"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant='primary'
              disabled={loading}
              className=""
            >
              {loading ? 'Tracking...' : 'Track'}
            </Button>
          </form>

          {error && (
            <div className="mt-4">
              <Alert type='error' closeable={false} icon={<AlertCircle />} className="flex">
                  <p className="text-sm">{error}</p>
              </Alert>
            </div>
          )}
        </div>
        {result && (
          <div className="space-y-6 mt-6">
            <Card className="rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-text">{result.trackingId}</h2>
                  <p className="text-sm text-text-muted">
                    Booked on {format(new Date(result.createdAt), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <Badge variant='default' className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                  {formatStatus(result.status)}
                </Badge>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs text-text-muted mb-2">
                  <span>Order Placed</span>
                  <span>Delivered</span>
                </div>
                  <ProgressBar value={getProgressPercentage(result.status)} contentPosition='right' contentClassName='hidden' />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-text">Pickup Address</h3>
                    <p className="text-sm text-text-muted">
                      {result.pickupAddress.street}<br />
                      {result.pickupAddress.city}, {result.pickupAddress.state} {result.pickupAddress.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-text">Delivery Address</h3>
                    <p className="text-sm text-text-muted">
                      {result.deliveryAddress.street}<br />
                      {result.deliveryAddress.city}, {result.deliveryAddress.state} {result.deliveryAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              <Divider />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">Weight:</span>
                    <p className="font-medium text-text">{result.parcelDetails.weight} kg</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Type:</span>
                    <p className="font-medium text-text capitalize">{result.parcelDetails.type}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Payment:</span>
                    <p className="font-medium text-text">${result.payment.amount} ({result.payment.type.toUpperCase()})</p>
                  </div>
                  {result.estimatedDelivery && (
                    <div>
                      <span className="text-text-muted">ETA:</span>
                      <p className="font-medium text-text">{format(new Date(result.estimatedDelivery), 'MMM dd, yyyy')}</p>
                    </div>
                  )}
                </div>
            </Card>

            <Card className="rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-text mb-4">Tracking History</h3>
              <Timeline position='right'>
                {result.statusHistory.map((event, index) => (
                  <TimelineItem key={index}>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium text-text">{formatStatus(event.status)}</span>
                          {event.notes && (
                            <span className="text-text-muted"> - {event.notes}</span>
                          )}
                        </p>
                        {event.updatedBy && (
                          <p className="text-xs text-text-muted">
                            Updated by {event.updatedBy.name}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-text-muted">
                        <time dateTime={event.timestamp}>
                          {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                        </time>
                      </div>
                    </div>
                  </TimelineItem>
                ))}
              </Timeline>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Track
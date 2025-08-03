import React from 'react';
import { format } from 'date-fns';
import { MapPin, Package, Clock, DollarSign, QrCode, Eye } from 'lucide-react';
import Link from 'next/link';
import { Badge, Card } from './aspect-ui';

interface ParcelCardProps {
  parcel: {
    _id: string;
    trackingId: string;
    status: string;
    pickupAddress: any;
    deliveryAddress: any;
    parcelDetails: any;
    payment: any;
    createdAt: string;
    estimatedDelivery?: string;
  };
}

export default function ParcelCard({ parcel }: ParcelCardProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-indigo-100 text-indigo-800',
      in_transit: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card className=" shadow rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-text">
              {parcel.trackingId}
            </h3>
            <p className="text-sm text-text-muted">
              Booked on {format(new Date(parcel.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${getStatusColor(parcel.status)} rounded-full`}>
            {formatStatus(parcel.status)}
          </Badge>
          <Link
            href={`/track/${parcel.trackingId}`}
            className="inline-flex items-center p-1.5 border border-transparent text-xs font-medium rounded text-text hover:text-primary-foreground hover:bg-primary transition-colors"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text">Pickup</p>
            <p className="text-xs truncate">
              {parcel.pickupAddress.street}, {parcel.pickupAddress.city}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text">Delivery</p>
            <p className="text-xs truncate">
              {parcel.deliveryAddress.street}, {parcel.deliveryAddress.city}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-text-muted">
          <div className="flex items-center space-x-1">
            <Package className="h-4 w-4" />
            <span>{parcel.parcelDetails.weight}kg</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span>${parcel.payment.amount}</span>
            <span className="capitalize">({parcel.payment.type})</span>
          </div>
        </div>

        {parcel.estimatedDelivery && (
          <div className="flex items-center space-x-1 text-sm text-text-muted">
            <Clock className="h-4 w-4" />
            <span>ETA: {format(new Date(parcel.estimatedDelivery), 'MMM dd')}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
'use client'
import { CheckCircle, MapPin, Navigation, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import LoadingSpinner from './LoadingSpinner';
import { Badge, Card, useToast } from './aspect-ui';

interface Parcel {
  _id: string;
  trackingId: string;
  status: string;
  pickupAddress: any;
  deliveryAddress: any;
  parcelDetails: any;
  payment: any;
  customer: any;
  createdAt: string;
  agent?: any;
}

export default function AgentDashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const {toast} = useToast()
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    fetchParcels();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    const handleParcelUpdated = (updatedParcel: Parcel) => {
      if (updatedParcel.agent?._id === user.id) {
        setParcels(prev =>
          prev.map(p => (p._id === updatedParcel._id ? updatedParcel : p))
        );
      }
    };

    const handleNewParcel = (newParcel: Parcel) => {
      if (newParcel.agent?._id === user.id) {
        setParcels(prev => [newParcel, ...prev]);
      }
    };

    socket.on('parcel-updated', handleParcelUpdated);
    socket.on('new-parcel', handleNewParcel);

    return () => {
      socket.off('parcel-updated', handleParcelUpdated);
      socket.off('new-parcel', handleNewParcel);
    };
  }, [socket, user]);

  const fetchParcels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://socket-server-cjq4.onrender.com/api/parcels', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setParcels(data);
      }
    } catch (error) {
      console.error('Error fetching parcels:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const updateParcelStatus = async (parcelId: string, status: string, notes?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://socket-server-cjq4.onrender.com/api/parcels/${parcelId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          notes,
          location: currentLocation
        })
      });

      if (response.ok) {
        toast({
          message: `Status updated successfully'}`,
          type: 'success',
          duration: 3000
        })
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast({
        message: `Failed to update parcel status`,
        type: 'error',
        duration: 3000
      })
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      assigned: 'picked_up',
      picked_up: 'in_transit',
      in_transit: 'out_for_delivery',
      out_for_delivery: 'delivered'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      assigned: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-indigo-100 text-indigo-800',
      in_transit: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getRouteUrl = (parcel: Parcel) => {
    const origin = `${parcel.pickupAddress.coordinates.lat},${parcel.pickupAddress.coordinates.lng}`;
    const destination = `${parcel.deliveryAddress.coordinates.lat},${parcel.deliveryAddress.coordinates.lng}`;
    return `https://www.google.com/maps/dir/${origin}/${destination}`;
  };

  if (loading) return <LoadingSpinner />;

  const pendingParcels = parcels.filter(p => ['assigned', 'picked_up', 'in_transit', 'out_for_delivery'].includes(p.status));
  const completedToday = parcels.filter(p => p.status === 'delivered' &&
    new Date(p.createdAt).toDateString() === new Date().toDateString()).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Agent Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">
            Welcome back, {user?.name}! Manage your assigned deliveries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="overflow-hidden shadow rounded-lg">
          <div className="px-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-text-muted truncate">
                    Pending Deliveries
                  </dt>
                  <dd className="text-lg font-medium text-text">
                    {pendingParcels.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden shadow rounded-lg">
          <div className="px-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-text-muted truncate">
                    Completed Today
                  </dt>
                  <dd className="text-lg font-medium text-text">
                    {completedToday}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        </div>

      <Card className="shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-text">Assigned Parcels</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {pendingParcels.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-text">No assigned parcels</h3>
              <p className="mt-1 text-sm text-text-muted">
                Check back later for new deliveries.
              </p>
            </div>
          ) : (
            pendingParcels.map((parcel) => (
              <div key={parcel._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-text">
                        {parcel.trackingId}
                      </h3>
                      <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(parcel.status)}`}>
                        {formatStatus(parcel.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-text">Pickup</p>
                          <p className="text-sm text-text-muted">
                            {parcel.pickupAddress.street}, {parcel.pickupAddress.city}
                          </p>
                          {parcel.pickupAddress.contactPhone && (
                            <p className="text-xs text-gray-400">
                              {parcel.pickupAddress.contactPhone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-text">Delivery</p>
                          <p className="text-sm text-text-muted">
                            {parcel.deliveryAddress.street}, {parcel.deliveryAddress.city}
                          </p>
                          {parcel.deliveryAddress.contactPhone && (
                            <p className="text-xs text-gray-400">
                              {parcel.deliveryAddress.contactPhone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-text-muted">
                        <span>{parcel.parcelDetails.weight}kg</span>
                        <span className="capitalize">{parcel.parcelDetails.type}</span>
                        <span>${parcel.parcelDetails.price} ({parcel.payment.type})</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <a
                          href={getRouteUrl(parcel)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Navigation className="h-4 w-4 mr-1" />
                          Route
                        </a>

                        {getNextStatus(parcel.status) && (
                          <button
                            onClick={() => updateParcelStatus(parcel._id, getNextStatus(parcel.status))}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                          >
                            Mark as {formatStatus(getNextStatus(parcel.status))}
                          </button>
                        )}

                        <button
                          onClick={() => updateParcelStatus(parcel._id, 'failed', 'Delivery attempt failed')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 transition-colors"
                        >
                          Mark Failed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
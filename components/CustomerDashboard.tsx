import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { CheckCircle, Clock, Package, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ParcelCard from './ParcelCard';
import { Badge, Button, Card } from './aspect-ui';

interface Parcel {
  _id: string;
  trackingId: string;
  status: string;
  pickupAddress: any;
  deliveryAddress: any;
  parcelDetails: any;
  payment: any;
  createdAt: string;
  estimatedDelivery?: string;
}

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchParcels();
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    const handleParcelUpdated = (updatedParcel: Parcel) => {
      if (updatedParcel?.customer?._id === user.id || updatedParcel?.agent?._id === user.id) {
        setParcels(prev =>
          prev.map(p => (p._id === updatedParcel._id ? updatedParcel : p))
        );
      }
    };

    const handleNewParcel = (newParcel: Parcel) => {
      if (user.role === 'admin' || user.role === 'agent') {
        setParcels(prev => [newParcel, ...prev]);
      } else if (newParcel.customer._id === user.id) {
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

  const getStatusStats = () => {
    const stats = {
      total: parcels.length,
      pending: parcels.filter(p => ['pending', 'assigned'].includes(p.status)).length,
      inTransit: parcels.filter(p => ['picked_up', 'in_transit', 'out_for_delivery'].includes(p.status)).length,
      delivered: parcels.filter(p => p.status === 'delivered').length,
      failed: parcels.filter(p => ['failed', 'cancelled'].includes(p.status)).length
    };
    return stats;
  };

  const filteredParcels = parcels.filter(parcel => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['pending', 'assigned'].includes(parcel.status);
    if (filter === 'in_transit') return ['picked_up', 'in_transit', 'out_for_delivery'].includes(parcel.status);
    if (filter === 'delivered') return parcel.status === 'delivered';
    if (filter === 'failed') return ['failed', 'cancelled'].includes(parcel.status);
    return true;
  });

  const stats = getStatusStats();

  if (loading) return <LoadingSpinner />;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Welcome back, {user?.name}!</h1>
          <p className="mt-1 text-sm">
            Manage your parcels and track deliveries
          </p>
        </div>
        <Link
          href="/book"
          
        >
          <Button variant='primary'>
            <Plus className="h-4 w-4 mr-2" />
            Book Your First Parcel
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="overflow-hidden shadow rounded-lg">
          <div className="px-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-text-muted truncate">
                    Total Parcels
                  </dt>
                  <dd className="text-lg font-medium text-text">
                    {stats.total}
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
                <Clock className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-text-muted truncate">
                    Pending
                  </dt>
                  <dd className="text-lg font-medium text-orange-600">
                    {stats.pending}
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
                <Search className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-text-muted truncate">
                    In Transit
                  </dt>
                  <dd className="text-lg font-medium text-blue-600">
                    {stats.inTransit}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card className=" overflow-hidden shadow rounded-lg">
          <div className="px-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-text-muted truncate">
                    Delivered
                  </dt>
                  <dd className="text-lg font-medium text-green-600">
                    {stats.delivered}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-bg shadow rounded-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[
              { key: 'all', label: 'All Parcels', count: stats.total },
              { key: 'pending', label: 'Pending', count: stats.pending },
              { key: 'in_transit', label: 'In Transit', count: stats.inTransit },
              { key: 'delivered', label: 'Delivered', count: stats.delivered },
              { key: 'failed', label: 'Issues', count: stats.failed }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`${filter === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge className={`ml-2 rounded-full text-xs ${filter === tab.key ? 'bg-primary/40 text-primary' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="space-y-4">
        {filteredParcels.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-text-muted" />
            <h3 className="mt-2 text-sm font-medium text-text">No parcels found</h3>
            <p className="mt-1 text-sm text-text-muted">
              {filter === 'all'
                ? "You haven't booked any parcels yet."
                : `No parcels found with status: ${filter}`
              }
            </p>
            {filter === 'all' && (
              <div className="mt-6">
                <Link
                  href="/book"

                ><Button variant='primary'>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Parcel
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          filteredParcels.map((parcel) => (
            <ParcelCard key={parcel._id} parcel={parcel} />
          ))
        )}
      </div>
    </div>
  )
}

export default CustomerDashboard
'use client'
import { DollarSign, Package, TrendingUp, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge, Button, Card, Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from './aspect-ui';
import LoadingSpinner from './LoadingSpinner';

interface DashboardStats {
  todayBookings: number;
  todayDeliveries: number;
  failedDeliveries: number;
  codTotal: number;
  statusDistribution: Array<{ _id: string; count: number }>;
  monthlyTrend: Array<{ _id: { year: number; month: number }; count: number }>;
  activeAgents: number;
  totalCustomers: number;
}

interface Parcel {
  _id: string;
  trackingId: string;
  status: string;
  customer: any;
  agent?: any;
  createdAt: string;
  payment: any;
  parcelDetails: any;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const getStatus = (status) => {
  switch (status) {
    case 'pending':
      return "Pending"
    case 'assigned':
      return "Assigned"
    case 'picked_up':
      return "Picked Up"
    case 'in_transit':
      return "In Transit"
    case 'out_for_delivery':
      return "Out For Delivery"
    case 'delivered':
      return "Delivered"
    default:
      return "Pending"
  }
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [statsRes, parcelsRes, agentsRes] = await Promise.all([
        fetch('https://socket-server-cjq4.onrender.com/api/reports/dashboard', { headers }),
        fetch('https://socket-server-cjq4.onrender.com/api/parcels', { headers }),
        fetch('https://socket-server-cjq4.onrender.com/api/users/agents', { headers })
      ]);

      if (statsRes.ok && parcelsRes.ok && agentsRes.ok) {
        const [statsData, parcelsData, agentsData] = await Promise.all([
          statsRes.json(),
          parcelsRes.json(),
          agentsRes.json()
        ]);

        setStats(statsData);
        setParcels(parcelsData);
        setAgents(agentsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignAgent = async (parcelId: string, agentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://socket-server-cjq4.onrender.com/api/parcels/${parcelId}/assign`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ agentId })
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error assigning agent:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const statusChartData = stats?.statusDistribution.map(item => ({
    name: item._id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: item.count
  })) || [];

  const monthlyChartData = stats?.monthlyTrend.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    parcels: item.count
  })) || [];

  const unassignedParcels = parcels.filter(p => p.status === 'pending');
  const availableAgents = agents.filter(a => a.isActive);
  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-text-muted">
          Comprehensive overview
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="overflow-hidden shadow rounded-lg">
          <div className="px-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-text-muted truncate">
                    Today&apos;s Bookings
                  </dt>
                  <dd className="text-lg font-medium text-text">
                    {stats?.todayBookings || 0}
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
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-text-muted truncate">
                    Delivered Today
                  </dt>
                  <dd className="text-lg font-medium text-text">
                    {stats?.todayDeliveries || 0}
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
                <DollarSign className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-text-muted truncate">
                    COD Collected
                  </dt>
                  <dd className="text-lg font-medium text-text">
                    ${stats?.codTotal || 0}
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
                <UserCheck className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-text-muted truncate">
                    Active Agents
                  </dt>
                  <dd className="text-lg font-medium text-text">
                    {stats?.activeAgents || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-bg shadow rounded-lg mb-6">
        <div className="border-b border-border">
          <nav className="-mb-px flex">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'parcels', label: 'Manage Parcels' },
              { key: 'agents', label: 'Agents' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`${activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-text hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <Card className=" p-6 shadow rounded-lg">
            <h3 className="text-lg font-medium text-text mb-4">Monthly Parcel Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="parcels" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className=" p-6 shadow rounded-lg">
            <h3 className="text-lg font-medium text-text mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
      {activeTab === 'parcels' && (
        <Card className="shadow rounded-lg">
          <div className='flex items-end justify-between w-full px-6 py-4 border-b border-gray-200'>
            <div className="">
              <h2 className="text-lg font-medium text-text">Unassigned Parcels</h2>
              <p className="text-sm text-text-muted">Assign delivery agents to pending parcels</p>
            </div>
            <Button size='small' variant='outline' onClick={() => { setShowAll(!showAll) }}>{showAll ? "Hide All" : "Show All"}</Button>
          </div>
          <div className="divide-y divide-gray-200">
            {showAll ? <>{parcels.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-text">No parcels</h3>
                <p className="mt-1 text-sm text-text-muted">No parcel has been listed.</p>
              </div>
            ) : (
              parcels.map((parcel) => (
                <div key={parcel._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-text">
                          {parcel.trackingId}
                        </h3>
                      </div>
                      <p className="text-sm text-text-muted">
                        Customer: {parcel.customer.name} ({parcel.customer.email})
                      </p>
                      <p className="text-sm text-gray-500">
                        Payment: ${parcel?.parcelDetails.value} ({parcel.payment.type})
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <Badge>{getStatus(parcel.status)}</Badge>
                      {parcel.status != "pending" &&
                        <span className="text-sm">Agent: {parcel.agent.name} ({parcel.agent.email})</span>}
                    </div>
                  </div>
                </div>
              ))
            )}</> : <>{unassignedParcels.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-text">No unassigned parcels</h3>
                <p className="mt-1 text-sm text-gray-500">All parcels have been assigned to agents.</p>
              </div>
            ) : (
              unassignedParcels.map((parcel) => (
                <div key={parcel._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-text">
                          {parcel.trackingId}
                        </h3>
                      </div>
                      <p className="text-sm text-text-muted">
                        Customer: {parcel.customer.name} ({parcel.customer.email})
                      </p>
                      <p className="text-sm text-gray-500">
                        Payment: ${parcel.parcelDetails.value} ({parcel.payment.type})
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800" variant='default'>
                        Pending Assignment
                      </Badge>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            assignAgent(parcel._id, e.target.value);
                          }
                        }}
                        className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        defaultValue=""
                      >
                        <option value="">Assign Agent</option>
                        {availableAgents.map((agent) => (
                          <option key={agent._id} value={agent._id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}</>}
          </div>
        </Card>
      )}
      {activeTab === 'agents' && (
        <Card className=" shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-text">Delivery Agents</h2>
            <p className="text-sm text-text-muted">Manage your delivery team</p>
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader className="bg-bg-light">
                <TableRow>
                  <TableHeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </TableHeadCell>
                  <TableHeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </TableHeadCell>
                  <TableHeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </TableHeadCell>
                  <TableHeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Parcels
                  </TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {agents.map((agent) => {
                  const assignedCount = parcels.filter(p => p.agent?._id === agent._id &&
                    ['assigned', 'picked_up', 'in_transit', 'out_for_delivery'].includes(p.status)).length;

                  return (
                    <TableRow key={agent._id}>
                      <TableCell>
                        <div className="">{agent.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="">{agent.email}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${agent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {agent.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="">
                        {assignedCount}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AdminDashboard
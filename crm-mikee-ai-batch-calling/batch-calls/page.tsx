'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Phone, Plus, Calendar, Users, CheckCircle, 
  XCircle, Clock, AlertCircle, RefreshCw 
} from 'lucide-react';

interface BatchCall {
  id: string;
  phone_number_id: string;
  name: string;
  agent_id: string;
  created_at_unix: number;
  scheduled_time_unix: number;
  total_calls_dispatched: number;
  total_calls_scheduled: number;
  last_updated_at_unix: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  agent_name: string;
  phone_provider: 'twilio' | 'sip_trunk' | null;
}

export default function BatchCallsPage() {
  const router = useRouter();
  const [batchCalls, setBatchCalls] = useState<BatchCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatchCalls();
  }, []);

  const fetchBatchCalls = async () => {
    try {
      const response = await fetch('/api/batch-calls');
      const data = await response.json();
      setBatchCalls(data.batch_calls || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching batch calls:', error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'in_progress':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (unixTimestamp: number) => {
    return new Date(unixTimestamp * 1000).toLocaleString();
  };

  const getProgress = (call: BatchCall) => {
    if (call.total_calls_scheduled === 0) return 0;
    return Math.round((call.total_calls_dispatched / call.total_calls_scheduled) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading batch calls...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Batch Calls</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor your outbound calling campaigns
            </p>
          </div>
          <button
            onClick={() => router.push('/batch-calls/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Batch Call
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{batchCalls.length}</p>
              </div>
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-blue-600">
                  {batchCalls.filter(c => c.status === 'in_progress' || c.status === 'pending').length}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {batchCalls.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Calls</p>
                <p className="text-2xl font-bold text-gray-900">
                  {batchCalls.reduce((sum, c) => sum + c.total_calls_scheduled, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Batch Calls List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {batchCalls.length === 0 ? (
            <div className="p-12 text-center">
              <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No batch calls yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first batch calling campaign to start reaching out to your contacts
              </p>
              <button
                onClick={() => router.push('/batch-calls/create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Batch Call
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheduled
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {batchCalls.map((call) => (
                    <tr 
                      key={call.id}
                      onClick={() => router.push(`/batch-calls/${call.id}`)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{call.name}</div>
                            <div className="text-sm text-gray-500">ID: {call.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(call.status)}
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(call.status)}`}>
                            {call.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              {call.total_calls_dispatched} / {call.total_calls_scheduled}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {getProgress(call)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getProgress(call)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{call.agent_name}</div>
                        <div className="text-sm text-gray-500">{call.phone_provider || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(call.created_at_unix)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {call.scheduled_time_unix ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(call.scheduled_time_unix)}
                          </div>
                        ) : (
                          'Immediate'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Phone, Calendar, Upload, Users, 
  CheckCircle, AlertCircle, X 
} from 'lucide-react';

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  company: string;
}

export default function CreateBatchCallPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [callName, setCallName] = useState('');
  const [agentId, setAgentId] = useState('');
  const [agentPhoneNumberId, setAgentPhoneNumberId] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  // Available contacts
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      const data = await response.json();
      setContacts(data.contacts || data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.phone && (
      c.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm)
    )
  );

  const toggleContact = (contact: Contact) => {
    if (selectedContacts.find(c => c.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const selectAll = () => {
    setSelectedContacts(filteredContacts);
  };

  const deselectAll = () => {
    setSelectedContacts([]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Prepare recipients
      const recipients = selectedContacts.map(c => ({
        phone_number: c.phone,
        first_name: c.first_name || '',
        last_name: c.last_name || '',
        email: c.email || '',
        company: c.company || '',
      }));

      // Calculate scheduled time unix if scheduled
      let scheduled_time_unix = null;
      if (scheduleType === 'scheduled' && scheduledDate && scheduledTime) {
        const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        scheduled_time_unix = Math.floor(dateTime.getTime() / 1000);
      }

      const response = await fetch('/api/batch-calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          call_name: callName,
          agent_id: agentId,
          agent_phone_number_id: agentPhoneNumberId,
          recipients,
          scheduled_time_unix,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create batch call');
      }

      const data = await response.json();
      router.push(`/batch-calls/${data.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return callName && agentId && agentPhoneNumberId;
    if (step === 2) return selectedContacts.length > 0;
    if (step === 3) {
      if (scheduleType === 'scheduled') {
        return scheduledDate && scheduledTime;
      }
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Batch Call</h1>
            <p className="text-sm text-gray-500 mt-1">
              Set up a new outbound calling campaign
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[
            { num: 1, label: 'Campaign Details' },
            { num: 2, label: 'Select Recipients' },
            { num: 3, label: 'Schedule' },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step > s.num ? 'bg-green-600' : step === s.num ? 'bg-blue-600' : 'bg-gray-300'
                } text-white font-medium`}>
                  {step > s.num ? <CheckCircle className="w-6 h-6" /> : s.num}
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  step >= s.num ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div className={`flex-1 h-1 mx-4 ${
                  step > s.num ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Step 1: Campaign Details */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Campaign Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={callName}
                    onChange={(e) => setCallName(e.target.value)}
                    placeholder="e.g., Weekly Follow-up Campaign"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent ID *
                  </label>
                  <input
                    type="text"
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    placeholder="Your ElevenLabs Agent ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Find this in your ElevenLabs dashboard under Agents
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number ID *
                  </label>
                  <input
                    type="text"
                    value={agentPhoneNumberId}
                    onChange={(e) => setAgentPhoneNumberId(e.target.value)}
                    placeholder="Your ElevenLabs Phone Number ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Find this in your ElevenLabs dashboard under Phone Numbers
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Recipients */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Select Recipients</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={selectAll}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Select All ({filteredContacts.length})
                    </button>
                    <button
                      onClick={deselectAll}
                      className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search contacts..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{selectedContacts.length} contacts selected</span>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredContacts.map((contact) => {
                  const isSelected = selectedContacts.find(c => c.id === contact.id);
                  return (
                    <div
                      key={contact.id}
                      onClick={() => toggleContact(contact)}
                      className={`px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={!!isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {contact.first_name} {contact.last_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {contact.phone}
                              {contact.company && ` • ${contact.company}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Schedule Campaign</h2>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="schedule"
                      checked={scheduleType === 'immediate'}
                      onChange={() => setScheduleType('immediate')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Send Immediately</div>
                      <div className="text-sm text-gray-500">Start calling as soon as you submit</div>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="schedule"
                      checked={scheduleType === 'scheduled'}
                      onChange={() => setScheduleType('scheduled')}
                      className="w-4 h-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-3">Schedule for Later</div>
                      {scheduleType === 'scheduled' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">Date</label>
                            <input
                              type="date"
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-1">Time</label>
                            <input
                              type="time"
                              value={scheduledTime}
                              onChange={(e) => setScheduledTime(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Campaign Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Campaign Name:</span>
                    <span className="font-medium text-gray-900">{callName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipients:</span>
                    <span className="font-medium text-gray-900">{selectedContacts.length} contacts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Schedule:</span>
                    <span className="font-medium text-gray-900">
                      {scheduleType === 'immediate' ? 'Immediate' : `${scheduledDate} at ${scheduledTime}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit Campaign
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


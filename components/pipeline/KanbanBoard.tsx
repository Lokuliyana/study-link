"use client";

import { useState, useEffect } from 'react';
import { Lead, PipelineStage } from '@/lib/types';
import { LeadCard } from './LeadCard';
import { LayoutDashboard, AlertCircle, CalendarClock, PhoneForwarded, Plus, X } from 'lucide-react';

const STAGES: PipelineStage[] = [
  'New Lead',
  'Triaged',
  'Appointment Set',
  'File Opened',
  'Visa Lodged',
  'Closed / Enrolled'
];

type TabType = 'Pipeline' | 'Action Needed' | 'Appointments' | 'Call Later';

export function KanbanBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('Pipeline');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const handleLeadAdded = () => fetchLeads();
    window.addEventListener('lead-added', handleLeadAdded);
    return () => window.removeEventListener('lead-added', handleLeadAdded);
  }, []);

  const handleStageChange = async (leadId: string, newStage: string, needsFollowUp?: boolean) => {
    const leadToUpdate = leads.find(l => l.id === leadId);
    if (!leadToUpdate) return;

    const updatedLead = {
      ...leadToUpdate,
      stage: newStage as PipelineStage,
      needsFollowUp: needsFollowUp !== undefined ? needsFollowUp : leadToUpdate.needsFollowUp
    };

    setLeads(leads.map(l => l.id === leadId ? updatedLead : l));

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLead),
      });
    } catch (error) {
      fetchLeads();
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    try {
      await fetch('/api/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId }),
      });
    } catch (error) {
      fetchLeads();
    }
  };

  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;

    const newLead: Lead = {
      id: crypto.randomUUID(),
      name: newLeadName,
      phone: newLeadPhone,
      stage: 'New Lead',
      createdAt: new Date().toISOString(),
      needsFollowUp: false,
    };

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
      setShowAddModal(false);
      setNewLeadName('');
      setNewLeadPhone('');
      fetchLeads();
    } catch (error) {
      console.error('Failed to add manual lead');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading pipeline...</div>;
  }

  // Filtered views based on tabs
  const actionNeededLeads = leads.filter(l => l.stage === 'New Lead' || l.stage === 'Triaged');
  const appointmentLeads = leads.filter(l => l.stage === 'Appointment Set');
  const followUpLeads = leads.filter(l => l.needsFollowUp);

  return (
    <div className="bg-transparent mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">CRM Tracking</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
        
        {/* Soft Tabs */}
        <div className="flex bg-gray-200/50 p-1 rounded-full border border-gray-200 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('Pipeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${activeTab === 'Pipeline' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Pipeline
          </button>
          <button 
            onClick={() => setActiveTab('Action Needed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${activeTab === 'Action Needed' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-red-500'}`}
          >
            <AlertCircle className="w-4 h-4" /> Action Needed 
            <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded-full">{actionNeededLeads.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('Appointments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${activeTab === 'Appointments' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-blue-500'}`}
          >
            <CalendarClock className="w-4 h-4" /> Appointments
            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full">{appointmentLeads.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('Call Later')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${activeTab === 'Call Later' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-amber-500'}`}
          >
            <PhoneForwarded className="w-4 h-4" /> Call Later
            <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full">{followUpLeads.length}</span>
          </button>
        </div>
      </div>
      
      {activeTab === 'Pipeline' ? (
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x">
          {STAGES.map(stage => {
            const stageLeads = leads.filter(l => l.stage === stage);
            const isNewLead = stage === 'New Lead';

            return (
              <div key={stage} className="w-[340px] shrink-0 snap-start flex flex-col max-h-[800px]">
                <div className="flex justify-between items-center mb-3 px-1">
                  <h3 className={`font-semibold text-sm ${isNewLead ? 'text-blue-600' : 'text-gray-700'}`}>
                    {stage}
                  </h3>
                  <span className={`text-xs font-bold py-0.5 px-2 rounded-full ${isNewLead ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                    {stageLeads.length}
                  </span>
                </div>
                
                <div className={`flex-1 rounded-2xl p-3 min-h-[150px] transition-colors border ${isNewLead ? 'bg-blue-50/30 border-blue-100' : 'bg-gray-50/50 border-gray-100/80'} overflow-y-auto`}>
                  {stageLeads.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-sm text-gray-400 font-medium">Empty</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stageLeads.map(lead => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onStageChange={handleStageChange}
                          onDelete={handleDeleteLead}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[400px]">
          {activeTab === 'Action Needed' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {actionNeededLeads.length === 0 && <p className="text-gray-400 p-4">No leads require immediate action.</p>}
              {actionNeededLeads.map(lead => <LeadCard key={lead.id} lead={lead} onStageChange={handleStageChange} onDelete={handleDeleteLead} />)}
            </div>
          )}
          {activeTab === 'Appointments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointmentLeads.length === 0 && <p className="text-gray-400 p-4">No upcoming appointments set.</p>}
              {appointmentLeads.map(lead => <LeadCard key={lead.id} lead={lead} onStageChange={handleStageChange} onDelete={handleDeleteLead} />)}
            </div>
          )}
          {activeTab === 'Call Later' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {followUpLeads.length === 0 && <p className="text-gray-400 p-4">No leads marked for follow-up.</p>}
              {followUpLeads.map(lead => <LeadCard key={lead.id} lead={lead} onStageChange={handleStageChange} onDelete={handleDeleteLead} />)}
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Add Manual Lead</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:bg-gray-100 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddManualLead} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  autoFocus
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={newLeadName}
                  onChange={e => setNewLeadName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">WhatsApp Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+94..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={newLeadPhone}
                  onChange={e => setNewLeadPhone(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-lg transition-colors mt-2"
              >
                Create Lead
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

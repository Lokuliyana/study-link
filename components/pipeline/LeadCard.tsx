import { Lead } from '@/lib/types';
import { MessageSquare, Calendar, Globe, Clock, Trash2, FileUser } from 'lucide-react';
import { useState } from 'react';
import { StudentProfileModal } from './StudentProfileModal';

interface LeadCardProps {
  lead: Lead;
  onStageChange: (leadId: string, newStage: string, needsFollowUp?: boolean) => void;
  onDelete?: (leadId: string) => void;
}

export function LeadCard({ lead, onStageChange, onDelete }: LeadCardProps) {
  const [showProfile, setShowProfile] = useState(false);
  const handleWhatsApp = () => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=Hi ${lead.name}, this is Study Link regarding your application for ${lead.matchedCountry || 'studies abroad'}. Please bring your certificates to our Nugegoda office.`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-[0_4px_14px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 leading-tight">{lead.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{lead.phone}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const updatedLead = { ...lead, needsFollowUp: !lead.needsFollowUp };
              onStageChange(lead.id, lead.stage, updatedLead.needsFollowUp);
            }}
            className={`p-1.5 rounded-full transition-colors border ${lead.needsFollowUp ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-gray-400 bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
            title="Mark for Follow Up"
          >
            <Clock className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleWhatsApp}
            className="text-green-600 bg-green-50 hover:bg-green-100 p-1.5 rounded-full transition-colors border border-green-100/50"
            title="1-Click WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          {lead.profile && (
            <button
              onClick={() => setShowProfile(true)}
              className="text-blue-500 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-full transition-colors border border-blue-100/50"
              title="View Student Profile"
            >
              <FileUser className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(lead.id)}
              className="text-red-400 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-colors border border-red-100/50"
              title="Delete Lead"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {lead.matchedCountry && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100/50">
            <Globe className="w-3 h-3" />
            {lead.matchedCountry}
          </span>
        )}
        {lead.appointmentDate && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-100/50">
            <Calendar className="w-3 h-3" />
            {lead.appointmentDate}{lead.appointmentTime ? ` @ ${lead.appointmentTime}` : ''}
          </span>
        )}
      </div>

      <select
        value={lead.stage}
        onChange={(e) => onStageChange(lead.id, e.target.value)}
        className="w-full text-xs font-medium text-gray-700 border border-gray-200 rounded-lg p-2 bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors outline-none cursor-pointer"
      >
        <option value="New Lead">New Lead</option>
        <option value="Triaged">Triaged</option>
        <option value="Appointment Set">Appointment Set</option>
        <option value="File Opened">File Opened</option>
        <option value="Visa Lodged">Visa Lodged</option>
        <option value="Closed / Enrolled">Closed / Enrolled</option>
      </select>

      {showProfile && (
        <StudentProfileModal lead={lead} onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

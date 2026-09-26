import { Lead } from '@/lib/types';
import { MessageSquare, Calendar, Globe, Clock } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onStageChange: (leadId: string, newStage: string, needsFollowUp?: boolean) => void;
}

export function LeadCard({ lead, onStageChange }: LeadCardProps) {
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
              // We dispatch to the parent to handle the API call
              onStageChange(lead.id, lead.stage, updatedLead.needsFollowUp);
            }}
            className={`p-2 rounded-full transition-colors border ${lead.needsFollowUp ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-gray-400 bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
            title="Mark for Follow Up"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button 
            onClick={handleWhatsApp}
            className="text-green-600 bg-green-50 hover:bg-green-100 p-2 rounded-full transition-colors border border-green-100/50"
            title="1-Click WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {lead.matchedCountry && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100/50">
            <Globe className="w-3 h-3" />
            {lead.matchedCountry}
          </span>
        )}
        {lead.targetIntake && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-100/50">
            <Calendar className="w-3 h-3" />
            {lead.targetIntake}
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
    </div>
  );
}

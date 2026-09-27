"use client";

import { Lead, StudentProfile } from '@/lib/types';
import { X, User, GraduationCap, Globe, Calendar, Briefcase, BookOpen, DollarSign, MessageSquare, Star } from 'lucide-react';

interface StudentProfileModalProps {
  lead: Lead;
  onClose: () => void;
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-b-0">
      <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function Chip({ value }: { value?: string }) {
  if (!value || value === 'None') return <span className="text-xs text-gray-400 italic">—</span>;
  return <span className="inline-block bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium px-2.5 py-1 rounded-full">{value}</span>;
}

export function StudentProfileModal({ lead, onClose }: StudentProfileModalProps) {
  const p: StudentProfile | undefined = lead.profile;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 pt-8 pb-5 flex items-start justify-between border-b border-gray-100">
          <div>
            <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-3">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{lead.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{lead.phone}</p>
          </div>
          <button onClick={onClose} className="bg-gray-50 hover:bg-gray-100 text-gray-400 p-2.5 rounded-full transition-all border border-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6">
          {/* Lead Meta */}
          <div className="flex flex-wrap gap-2">
            {lead.matchedCountry && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Globe className="w-3 h-3" /> {lead.matchedCountry}
              </span>
            )}
            {lead.appointmentDate && (
              <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-100 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Calendar className="w-3 h-3" /> {lead.appointmentDate}{lead.appointmentTime ? ` @ ${lead.appointmentTime}` : ''}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              {lead.stage}
            </span>
          </div>

          {!p ? (
            <p className="text-gray-400 italic text-sm">No profile data was captured for this lead.</p>
          ) : (
            <>
              {/* Academic Qualifications */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Academic Qualifications</h3>
                <div className="bg-gray-50/50 rounded-2xl border border-gray-100 px-5 py-1">
                  <Row icon={<User className="w-4 h-4 text-gray-500" />} label="Age" value={p.age ? String(p.age) : undefined} />
                  <Row icon={<GraduationCap className="w-4 h-4 text-gray-500" />} label="O/L Status" value={p.olQual !== 'None' ? p.olQual : undefined} />
                  <Row icon={<GraduationCap className="w-4 h-4 text-gray-500" />} label="A/L Result" value={p.alQual !== 'None' ? p.alQual : undefined} />
                  <Row icon={<BookOpen className="w-4 h-4 text-gray-500" />} label="Degree Status" value={p.degreeStatus} />
                  <Row icon={<Star className="w-4 h-4 text-gray-500" />} label="GPA" value={p.gpa !== 'None' ? p.gpa : undefined} />
                  <Row icon={<Star className="w-4 h-4 text-gray-500" />} label="Degree Class" value={p.degreeClass !== 'None' ? p.degreeClass : undefined} />
                  <Row icon={<MessageSquare className="w-4 h-4 text-gray-500" />} label="English Test" value={p.englishTest} />
                </div>
              </div>

              {/* Preferences */}
              {(p.preferredStudyLevel || p.budget || p.preferredField || p.preferredCountry || p.workExperience || p.studyGap) && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Preferences & Background</h3>
                  <div className="bg-gray-50/50 rounded-2xl border border-gray-100 px-5 py-1">
                    <Row icon={<BookOpen className="w-4 h-4 text-gray-500" />} label="Preferred Study Level" value={p.preferredStudyLevel} />
                    <Row icon={<DollarSign className="w-4 h-4 text-gray-500" />} label="Budget" value={p.budget} />
                    <Row icon={<Globe className="w-4 h-4 text-gray-500" />} label="Preferred Country" value={p.preferredCountry} />
                    <Row icon={<Briefcase className="w-4 h-4 text-gray-500" />} label="Preferred Field / Course" value={p.preferredField} />
                    <Row icon={<Briefcase className="w-4 h-4 text-gray-500" />} label="Work Experience" value={p.workExperience} />
                    <Row icon={<Calendar className="w-4 h-4 text-gray-500" />} label="Study Gap" value={p.studyGap} />
                  </div>
                </div>
              )}

              {/* Custom Fields */}
              {p.customValues && Object.keys(p.customValues).length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Additional Criteria</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(p.customValues).map(([k, v]) => v && (
                      <span key={k} className="bg-amber-50 text-amber-700 border border-amber-100 text-xs font-medium px-2.5 py-1 rounded-full">{v}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {p.otherRequirements && (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Notes</h3>
                  <div className="bg-yellow-50/50 border border-yellow-100 rounded-2xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">{p.otherRequirements}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

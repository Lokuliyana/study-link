import { CountryRule, StudentProfile } from '@/lib/types';
import { X, PhoneCall, Quote, User, Calendar, MessageSquare, ChevronRight, Clock } from 'lucide-react';
import { useState } from 'react';

interface CallScriptModalProps {
  country: CountryRule;
  profile: StudentProfile;
  onClose: () => void;
  onLeadCaptured: (leadData: { name: string; phone: string; appointmentDate: string; appointmentTime: string; profile: StudentProfile }) => void;
}

export function CallScriptModal({ country, profile, onClose, onLeadCaptured }: CallScriptModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onLeadCaptured({ name, phone, appointmentDate, appointmentTime, profile });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] max-w-lg w-full overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
      >
        {/* Elegant Header */}
        <div className="px-8 pt-8 pb-6 flex justify-between items-start relative">
          <div className="absolute top-0 right-0 p-6">
            <button 
              onClick={onClose} 
              className="bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 p-2.5 rounded-full transition-all border border-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Pitching {country.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Read the script below and capture the lead</p>
          </div>
        </div>
        
        <div className="px-8 pb-8 space-y-8">
          {/* Script Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl p-6 relative group overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 text-blue-200 opacity-30 transform -scale-x-100">
              <Quote className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Live Hook Script
              </p>
              <p className="text-blue-900 text-base md:text-lg italic leading-relaxed font-medium">
                "{country.hookScript}"
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Book Appointment</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="Student Name (e.g. Kasun Silva)"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <PhoneCall className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                  placeholder="WhatsApp Number (+94...)"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  required
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 group"
              >
                Capture Lead & Close
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

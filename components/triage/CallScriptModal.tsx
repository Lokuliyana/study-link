import { CountryRule } from '@/lib/types';
import { X, PhoneCall } from 'lucide-react';
import { useState } from 'react';

interface CallScriptModalProps {
  country: CountryRule;
  onClose: () => void;
  onLeadCaptured: (leadData: { name: string; phone: string; intake: string }) => void;
}

export function CallScriptModal({ country, onClose, onLeadCaptured }: CallScriptModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [intake, setIntake] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onLeadCaptured({ name, phone, intake: intake || 'Upcoming' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PhoneCall className="w-5 h-5" />
            Pitching {country.name}
          </h2>
          <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <p className="font-semibold text-blue-900 mb-2">Appointment Hook Script:</p>
            <p className="text-blue-800 italic leading-relaxed">
              "{country.hookScript}"
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">Log Lead Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Kasun Silva"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="+94 77 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Intake</label>
              <select 
                value={intake}
                onChange={(e) => setIntake(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select Intake</option>
                <option value="Sept/Oct 2024">Sept/Oct 2024</option>
                <option value="Jan/Feb 2025">Jan/Feb 2025</option>
                <option value="May/June 2025">May/June 2025</option>
              </select>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
              >
                Log Lead & Set Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

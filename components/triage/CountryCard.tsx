import { CountryRule } from '@/lib/types';
import { CheckCircle2, DollarSign, GraduationCap, Clock } from 'lucide-react';

interface CountryCardProps {
  country: CountryRule;
  onSelect: (country: CountryRule) => void;
}

export function CountryCard({ country, onSelect }: CountryCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-100 shadow-[0_4px_14px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] transition-all flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50 pointer-events-none transition-opacity group-hover:opacity-100"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900">{country.name}</h3>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <div className="pt-1.5">
              <p className="text-gray-900 font-medium leading-none mb-1">Age Limit</p>
              <p className="text-gray-500 text-xs">Max Age: {country.ageLimit}</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
              <GraduationCap className="w-4 h-4 text-gray-500" />
            </div>
            <div className="pt-1.5 w-full">
              <p className="text-gray-900 font-medium leading-none mb-1">Academics Accepted</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {country.acceptedOlQuals && country.acceptedOlQuals.slice(0,3).map(q => (
                  <span key={q} className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded border border-gray-200">{q} (O/L)</span>
                ))}
                {country.acceptedDegreeStatus && country.acceptedDegreeStatus.slice(0,2).map(q => (
                  <span key={q} className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded border border-gray-200">{q} (Degree)</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div className="pt-1.5">
              <p className="text-gray-900 font-medium leading-none mb-1">English</p>
              <p className="text-gray-500 text-xs leading-relaxed">{country.englishRequirement}</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div className="pt-1.5">
              <p className="text-gray-900 font-medium leading-none mb-1">Funds / Cost</p>
              <p className="text-gray-500 text-xs leading-relaxed">{country.bankProofAndCost}</p>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => onSelect(country)}
        className="mt-6 w-full bg-gray-50 hover:bg-blue-600 text-gray-700 hover:text-white font-medium py-2.5 rounded-xl transition-colors relative z-10 border border-gray-200 hover:border-blue-600 text-sm"
      >
        View Call Script
      </button>
    </div>
  );
}

import { EligibleCountry } from '@/lib/types';
import { CheckCircle2, DollarSign, GraduationCap, Clock, Users } from 'lucide-react';

interface CountryCardProps {
  country: EligibleCountry;
  onSelect: (country: EligibleCountry) => void;
}

const ELIGIBILITY_CONFIG = {
  Both: { label: 'UG + Masters', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
  UG: { label: 'Undergrad Only', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  PG: { label: 'Masters Only', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
};

export function CountryCard({ country, onSelect }: CountryCardProps) {
  const elig = ELIGIBILITY_CONFIG[country.eligibleFor];

  return (
    <div className={`group bg-white rounded-2xl p-5 border shadow-[0_4px_14px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between h-full relative overflow-hidden ${country.eligibleFor === 'PG' ? 'border-purple-100 hover:border-purple-200' : 'border-gray-100 hover:border-blue-100'}`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        {/* Header: country name + eligibility badge */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900">{country.name}</h3>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${elig.bg} ${elig.text} ${elig.border} shrink-0 ml-2`}>
            {elig.label}
          </span>
        </div>

        {/* Age limits */}
        <div className="flex gap-3 items-start mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
            <Clock className="w-4 h-4 text-gray-500" />
          </div>
          <div className="pt-1.5">
            <p className="text-gray-900 font-medium leading-none mb-1.5">Age Limits</p>
            <div className="flex gap-2">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${country.eligibleFor === 'UG' || country.eligibleFor === 'Both' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-100 text-gray-400 border-gray-100'}`}>
                UG &lt; {country.ageLimitUG}
              </span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${country.eligibleFor === 'PG' || country.eligibleFor === 'Both' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-100 text-gray-400 border-gray-100'}`}>
                PG &lt; {country.ageLimitPG}
              </span>
            </div>
          </div>
        </div>

        {/* Academic requirements */}
        <div className="flex gap-3 items-start mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
            <GraduationCap className="w-4 h-4 text-gray-500" />
          </div>
          <div className="pt-1.5 w-full">
            <p className="text-gray-900 font-medium leading-none mb-2">Academics</p>
            <div className="flex flex-wrap gap-1">
              {country.acceptedAlQuals?.map(q => (
                <span key={q} className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded border border-blue-100">A/L {q}</span>
              ))}
              {country.acceptedDegreeStatus?.slice(0, 2).map(q => (
                <span key={q} className="bg-purple-50 text-purple-600 text-[10px] px-1.5 py-0.5 rounded border border-purple-100">{q}</span>
              ))}
            </div>
          </div>
        </div>

        {/* English */}
        <div className="flex gap-3 items-start mb-4">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="pt-1.5">
            <p className="text-gray-900 font-medium leading-none mb-1">English</p>
            <p className="text-gray-500 text-xs leading-relaxed">{country.englishRequirement}</p>
          </div>
        </div>

        {/* Cost */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="pt-1.5">
            <p className="text-gray-900 font-medium leading-none mb-1">Budget / Funds</p>
            <p className="text-gray-500 text-xs leading-relaxed">{country.bankProofAndCost}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSelect(country)}
        className="mt-6 w-full bg-gray-50 hover:bg-blue-600 text-gray-700 hover:text-white font-medium py-2.5 rounded-xl transition-colors relative z-10 border border-gray-200 hover:border-blue-600 text-sm"
      >
        View Call Script & Book
      </button>
    </div>
  );
}

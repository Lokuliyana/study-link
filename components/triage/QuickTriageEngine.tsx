"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { StudentProfile, CountryRule, OLQualification, ALQualification, DegreeStatus, GPAScore, DegreeClass, CustomField } from '@/lib/types';
import { matchCountries } from '@/lib/matcher';
import { CountryCard } from './CountryCard';
import { CallScriptModal } from './CallScriptModal';
import { Sparkles, User, GraduationCap, CheckCircle } from 'lucide-react';

export function QuickTriageEngine() {
  const [profile, setProfile] = useState<StudentProfile>({
    age: 0,
    olQual: 'None',
    alQual: 'None',
    degreeStatus: "Haven't done at all",
    gpa: 'None',
    degreeClass: 'None',
    englishTest: 'None',
  });

  const [selectedCountry, setSelectedCountry] = useState<CountryRule | null>(null);
  const [rules, setRules] = useState<CountryRule[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const ageInputRef = useRef<HTMLInputElement>(null);

  // Focus age input on mount
  useEffect(() => {
    ageInputRef.current?.focus();
  }, []);

  // Fetch live rules and custom field definitions
  useEffect(() => {
    fetch('/api/rules').then(r => r.json()).then(setRules);
    fetch('/api/customfields').then(r => r.json()).then(d => setCustomFields(Array.isArray(d) ? d : []));
  }, []);

  const updateProfile = (key: keyof StudentProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const updateCustomValue = (fieldKey: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      customValues: { ...(prev.customValues || {}), [fieldKey]: value },
    }));
  };

  // Sub-50ms live matching
  const eligibleCountries = useMemo(() => matchCountries(profile, rules), [profile, rules]);

  const handleLeadCaptured = async (leadData: {
    name: string;
    phone: string;
    appointmentDate: string;
    appointmentTime: string;
    profile: StudentProfile;
  }) => {
    const newLead = {
      id: crypto.randomUUID(),
      name: leadData.name,
      phone: leadData.phone,
      appointmentDate: leadData.appointmentDate,
      appointmentTime: leadData.appointmentTime,
      stage: 'Appointment Set',
      matchedCountry: selectedCountry?.name,
      createdAt: new Date().toISOString(),
      needsFollowUp: false,
      profile: leadData.profile,
    };

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
      setSelectedCountry(null);
      window.dispatchEvent(new Event('lead-added'));
    } catch (error) {
      console.error('Failed to log lead', error);
    }
  };

  const chipClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer ${
      active ? 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    }`;

  return (
    <div className="bg-white rounded-[32px] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] border border-gray-100 p-8 mb-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              Triage Engine
            </h2>
            <p className="text-gray-500 mt-1">Live candidate eligibility matching</p>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-medium border flex items-center gap-2 ${eligibleCountries.length > 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
            <CheckCircle className="w-4 h-4" />
            {eligibleCountries.length} {eligibleCountries.length === 1 ? 'Match' : 'Matches'}
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 bg-gray-50/50 rounded-2xl p-6 border border-gray-100/80">

          {/* Age */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" /> Age
            </label>
            <input
              ref={ageInputRef}
              type="number"
              min={15}
              max={65}
              placeholder="Type age..."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={profile.age || ''}
              onChange={(e) => updateProfile('age', parseInt(e.target.value) || 0)}
            />
          </div>

          {/* O/L */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">O/L Status</label>
            <div className="flex flex-wrap gap-2">
              {(['Pass', 'Fail', 'None'] as OLQualification[]).map(q => (
                <button key={q} onClick={() => updateProfile('olQual', q)} className={chipClass(profile.olQual === q)}>{q}</button>
              ))}
            </div>
          </div>

          {/* A/L */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">A/L Result</label>
            <div className="flex flex-wrap gap-2">
              {(['3S', '3C', '3B', 'None'] as ALQualification[]).map(q => (
                <button key={q} onClick={() => updateProfile('alQual', q)} className={chipClass(profile.alQual === q)}>{q}</button>
              ))}
            </div>
          </div>

          {/* Degree Status */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-gray-400" /> Degree Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(["Completed", "Pending", "Haven't done at all"] as DegreeStatus[]).map(q => (
                <button
                  key={q}
                  onClick={() => {
                    updateProfile('degreeStatus', q);
                    if (q === "Haven't done at all") {
                      updateProfile('gpa', 'None');
                      updateProfile('degreeClass', 'None');
                    }
                  }}
                  className={chipClass(profile.degreeStatus === q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* GPA */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">GPA Score</label>
            <div className="flex flex-wrap gap-2">
              {(['2.0', '2.5', '3.0', 'None'] as GPAScore[]).map(q => (
                <button
                  key={q}
                  disabled={profile.degreeStatus === "Haven't done at all"}
                  onClick={() => updateProfile('gpa', q)}
                  className={`${chipClass(profile.gpa === q)} ${profile.degreeStatus === "Haven't done at all" ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Degree Class */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <label className="text-sm font-semibold text-gray-700">Degree Class</label>
            <div className="flex flex-wrap gap-2">
              {(['Second Class Lower', 'Second Class Upper', 'First Class', 'None'] as DegreeClass[]).map(q => (
                <button
                  key={q}
                  disabled={profile.degreeStatus === "Haven't done at all"}
                  onClick={() => updateProfile('degreeClass', q)}
                  className={`${chipClass(profile.degreeClass === q)} ${profile.degreeStatus === "Haven't done at all" ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* English Test */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">English Test</label>
            <div className="flex flex-wrap gap-2">
              {['None', 'IELTS', 'Duolingo'].map(test => (
                <button
                  key={test}
                  onClick={() => updateProfile('englishTest', test)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${profile.englishTest === test ? 'bg-gray-800 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                  {test}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic custom fields */}
          {customFields.map(cf => (
            <div key={cf.key} className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">{cf.label}</label>
              <div className="flex flex-wrap gap-2">
                {cf.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => updateCustomValue(cf.key, opt === profile.customValues?.[cf.key] ? '' : opt)}
                    className={chipClass(profile.customValues?.[cf.key] === opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div>
          {eligibleCountries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {eligibleCountries.map(country => (
                <CountryCard key={country.id} country={country} onSelect={setSelectedCountry} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No countries match the current profile.</p>
              <p className="text-gray-400 text-sm mt-1">Try relaxing some of the filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {selectedCountry && (
        <CallScriptModal
          country={selectedCountry}
          profile={profile}
          onClose={() => setSelectedCountry(null)}
          onLeadCaptured={handleLeadCaptured}
        />
      )}
    </div>
  );
}

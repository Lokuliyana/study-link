"use client";

import { useState, useMemo, useEffect } from 'react';
import { StudentProfile, CountryRule } from '@/lib/types';
import { matchCountries } from '@/lib/matcher';
import { CountryCard } from './CountryCard';
import { CallScriptModal } from './CallScriptModal';
import { Sparkles, User, GraduationCap, Clock, CheckCircle } from 'lucide-react';

export function QuickTriageEngine() {
  const [profile, setProfile] = useState<StudentProfile>({
    age: 20,
    gapYears: 0,
    level: 'UG',
    ugQual: 'A/L (3 Passes)',
    englishTest: 'None',
  });

  const [selectedCountry, setSelectedCountry] = useState<CountryRule | null>(null);
  const [rules, setRules] = useState<CountryRule[]>([]);

  // Fetch dynamic rules on mount so edits from the Matrix are immediately respected
  useEffect(() => {
    fetch('/api/rules')
      .then(res => res.json())
      .then(data => setRules(data));
  }, []);

  // Sub-50ms calculation
  const eligibleCountries = useMemo(() => matchCountries(profile, rules), [profile, rules]);

  const handleLeadCaptured = async (leadData: { name: string; phone: string; intake: string }) => {
    const newLead = {
      id: crypto.randomUUID(),
      name: leadData.name,
      phone: leadData.phone,
      targetIntake: leadData.intake,
      stage: 'Appointment Set',
      matchedCountry: selectedCountry?.name,
      createdAt: new Date().toISOString(),
      needsFollowUp: false,
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

  return (
    <div className="bg-white rounded-[32px] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] border border-gray-100 p-8 mb-10 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-50/50 blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              Triage Engine
            </h2>
            <p className="text-gray-500 mt-1">Live candidate eligibility matching</p>
          </div>
          <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium border border-green-100/50 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {eligibleCountries.length} Matches Found
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10 bg-gray-50/50 rounded-2xl p-6 border border-gray-100/80">
          {/* Level Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              Study Level
            </label>
            <div className="flex gap-2">
              {['UG', 'PG'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setProfile({ ...profile, level: lvl as 'UG' | 'PG' })}
                  className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
                    profile.level === lvl 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {lvl === 'UG' ? 'Undergrad' : 'Postgrad'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Age & Gap */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Age
            </label>
            <input 
              type="number" 
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={profile.age || ''}
              onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              Gap Years
            </label>
            <input 
              type="number" 
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={profile.gapYears === 0 ? '' : profile.gapYears}
              placeholder="0"
              onChange={(e) => setProfile({ ...profile, gapYears: parseInt(e.target.value) || 0 })}
            />
          </div>

          {/* Qualifications Contextual Chips */}
          <div className="space-y-3 col-span-1 lg:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Highest Qualification</label>
            <div className="flex flex-wrap gap-2">
              {profile.level === 'UG' ? (
                ['O/L Only', 'A/L (2 Passes)', 'A/L (3 Passes)', 'A/L (High Grades)', 'Foundation'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setProfile({ ...profile, ugQual: q as any })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      profile.ugQual === q 
                        ? 'bg-blue-100 text-blue-800 border-blue-200' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {q}
                  </button>
                ))
              ) : (
                ['Diploma', '3-Year Degree', '4-Year Degree', 'High GPA Degree'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setProfile({ ...profile, pgQual: q as any })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      profile.pgQual === q 
                        ? 'bg-blue-100 text-blue-800 border-blue-200' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {q}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* English Test */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">English Test</label>
            <div className="flex flex-wrap gap-2">
              {['None', 'IELTS', 'Duolingo'].map((test) => (
                <button
                  key={test}
                  onClick={() => setProfile({ ...profile, englishTest: test })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    profile.englishTest === test 
                      ? 'bg-gray-800 text-white shadow-sm' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {test}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          {eligibleCountries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {eligibleCountries.map(country => (
                <CountryCard 
                  key={country.id} 
                  country={country} 
                  onSelect={setSelectedCountry} 
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No countries match the current profile criteria.</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting the age or gap years.</p>
            </div>
          )}
        </div>
      </div>

      {selectedCountry && (
        <CallScriptModal 
          country={selectedCountry} 
          onClose={() => setSelectedCountry(null)}
          onLeadCaptured={handleLeadCaptured}
        />
      )}
    </div>
  );
}

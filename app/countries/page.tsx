"use client";

import { useState, useEffect } from 'react';
import { CountryRule, UGQualification, PGQualification } from '@/lib/types';
import { Search, Edit2, Save, X, Info, Check } from 'lucide-react';

const UG_OPTIONS: UGQualification[] = ['O/L Only', 'A/L (2 Passes)', 'A/L (3 Passes)', 'A/L (High Grades)', 'Foundation'];
const PG_OPTIONS: PGQualification[] = ['Diploma', '3-Year Degree', '4-Year Degree', 'High GPA Degree'];

export default function CountriesMatrixPage() {
  const [search, setSearch] = useState('');
  const [rules, setRules] = useState<CountryRule[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/rules')
      .then(res => res.json())
      .then(data => {
        setRules(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rules),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save rules');
    } finally {
      setSaving(false);
    }
  };

  const updateRule = (id: string, field: keyof CountryRule, value: any) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const toggleQual = (ruleId: string, level: 'UG' | 'PG', qual: string) => {
    setRules(rules.map(r => {
      if (r.id !== ruleId) return r;
      if (level === 'UG') {
        const ug = r.acceptedUgQuals || [];
        const newUg = ug.includes(qual as UGQualification) ? ug.filter(q => q !== qual) : [...ug, qual as UGQualification];
        return { ...r, acceptedUgQuals: newUg };
      } else {
        const pg = r.acceptedPgQuals || [];
        const newPg = pg.includes(qual as PGQualification) ? pg.filter(q => q !== qual) : [...pg, qual as PGQualification];
        return { ...r, acceptedPgQuals: newPg };
      }
    }));
  };

  const filteredRules = rules.filter(rule => 
    rule.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Matrix...</div>;

  return (
    <div className="bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Country Rules Matrix</h1>
          <p className="text-sm text-gray-500 mt-1">Live configuration for triage logic and pitch hooks</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search countries..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full font-medium text-sm transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Matrix
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-gray-900 w-1/5">Destination & Limits</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-gray-900">Accepted Qualifications (Logic)</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-gray-900 w-1/4">Pitch Hook (Counselor Script)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Destination & Basic Limits */}
                    <td className="px-6 py-5 whitespace-nowrap align-top">
                      <div className="font-bold text-gray-900 text-base mb-3">{rule.name}</div>
                      
                      {isEditing ? (
                        <div className="space-y-2 max-w-[200px]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-600">Age UG</span>
                            <input type="number" value={rule.ageLimitUG} onChange={(e) => updateRule(rule.id, 'ageLimitUG', parseInt(e.target.value))} className="w-16 border rounded px-1.5 py-1 text-xs" />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-600">Age PG</span>
                            <input type="number" value={rule.ageLimitPG} onChange={(e) => updateRule(rule.id, 'ageLimitPG', parseInt(e.target.value))} className="w-16 border rounded px-1.5 py-1 text-xs" />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-600">Gap (yrs)</span>
                            <input type="number" value={rule.gapYearsAccepted} onChange={(e) => updateRule(rule.id, 'gapYearsAccepted', parseInt(e.target.value))} className="w-16 border rounded px-1.5 py-1 text-xs" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-medium">UG &lt; {rule.ageLimitUG}</span>
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-medium">PG &lt; {rule.ageLimitPG}</span>
                          </div>
                          <div className="inline-block"><span className="bg-gray-800 text-white text-xs px-2 py-0.5 rounded font-medium">Max Gap: {rule.gapYearsAccepted}y</span></div>
                        </div>
                      )}
                    </td>
                    
                    {/* Logical Stats (Qualifications) */}
                    <td className="px-6 py-5 align-top">
                      <div className="space-y-4">
                        {/* UG Quals */}
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">UG Entry Accepts</p>
                          <div className="flex flex-wrap gap-1.5">
                            {UG_OPTIONS.map(opt => {
                              const isAccepted = rule.acceptedUgQuals?.includes(opt);
                              return isEditing ? (
                                <button
                                  key={opt}
                                  onClick={() => toggleQual(rule.id, 'UG', opt)}
                                  className={`px-2 py-1 rounded text-xs font-medium border transition-colors flex items-center gap-1 ${isAccepted ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                                >
                                  {isAccepted && <Check className="w-3 h-3" />}
                                  {opt}
                                </button>
                              ) : (
                                isAccepted && (
                                  <span key={opt} className="bg-blue-50 border border-blue-100 text-blue-700 text-[11px] px-2 py-0.5 rounded font-medium">
                                    {opt}
                                  </span>
                                )
                              );
                            })}
                            {!isEditing && (!rule.acceptedUgQuals || rule.acceptedUgQuals.length === 0) && (
                              <span className="text-xs text-gray-400 italic">None specified</span>
                            )}
                          </div>
                        </div>

                        {/* PG Quals */}
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">PG Entry Accepts</p>
                          <div className="flex flex-wrap gap-1.5">
                            {PG_OPTIONS.map(opt => {
                              const isAccepted = rule.acceptedPgQuals?.includes(opt);
                              return isEditing ? (
                                <button
                                  key={opt}
                                  onClick={() => toggleQual(rule.id, 'PG', opt)}
                                  className={`px-2 py-1 rounded text-xs font-medium border transition-colors flex items-center gap-1 ${isAccepted ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                                >
                                  {isAccepted && <Check className="w-3 h-3" />}
                                  {opt}
                                </button>
                              ) : (
                                isAccepted && (
                                  <span key={opt} className="bg-purple-50 border border-purple-100 text-purple-700 text-[11px] px-2 py-0.5 rounded font-medium">
                                    {opt}
                                  </span>
                                )
                              );
                            })}
                            {!isEditing && (!rule.acceptedPgQuals || rule.acceptedPgQuals.length === 0) && (
                              <span className="text-xs text-gray-400 italic">None specified</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Pitch Hook */}
                    <td className="px-6 py-5 align-top">
                      {isEditing ? (
                        <textarea 
                          value={rule.hookScript || ''}
                          onChange={(e) => updateRule(rule.id, 'hookScript', e.target.value)}
                          className="w-full h-32 text-sm border border-blue-300 bg-blue-50/30 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                          placeholder="Enter pitch script here..."
                        />
                      ) : (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 relative group">
                          <Info className="w-4 h-4 text-blue-400 absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <p className="text-blue-900 text-sm italic leading-relaxed pr-6">
                            "{rule.hookScript}"
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

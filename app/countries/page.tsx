"use client";

import { useState, useEffect } from 'react';
import { CountryRule, OLQualification, ALQualification, DegreeStatus, GPAScore, DegreeClass, CustomField } from '@/lib/types';
import { Search, Edit2, Save, X, Info, Check, Plus, Trash2 } from 'lucide-react';

const OL_OPTIONS: OLQualification[] = ['Pass', 'Fail', 'None'];
const AL_OPTIONS: ALQualification[] = ['3S', '3C', '3B', 'None'];
const DEGREE_OPTIONS: DegreeStatus[] = ['Completed', 'Pending', "Haven't done at all"];
const GPA_OPTIONS: GPAScore[] = ['2.0', '2.5', '3.0', 'None'];
const DEGREE_CLASS_OPTIONS: DegreeClass[] = ['Second Class Lower', 'Second Class Upper', 'First Class', 'None'];

export default function CountriesMatrixPage() {
  const [search, setSearch] = useState('');
  const [rules, setRules] = useState<CountryRule[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New custom field form state
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldOptions, setNewFieldOptions] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/rules').then(r => r.json()),
      fetch('/api/customfields').then(r => r.json()),
    ]).then(([rulesData, fieldsData]) => {
      setRules(rulesData);
      setCustomFields(Array.isArray(fieldsData) ? fieldsData : []);
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

  const toggleQual = (ruleId: string, arrayField: string, qual: string) => {
    setRules(rules.map(r => {
      if (r.id !== ruleId) return r;
      const current = (r[arrayField as keyof CountryRule] as string[]) || [];
      const next = current.includes(qual) ? current.filter(q => q !== qual) : [...current, qual];
      return { ...r, [arrayField]: next };
    }));
  };

  const toggleCustomQual = (ruleId: string, fieldKey: string, opt: string) => {
    setRules(rules.map(r => {
      if (r.id !== ruleId) return r;
      const current = r.customValues?.[fieldKey] || [];
      const next = current.includes(opt) ? current.filter(q => q !== opt) : [...current, opt];
      return { ...r, customValues: { ...(r.customValues || {}), [fieldKey]: next } };
    }));
  };

  const handleAddCountry = () => {
    const newId = `country_${Date.now()}`;
    const newRule: CountryRule = {
      id: newId,
      name: 'New Country',
      ageLimitUG: 30,
      ageLimitPG: 40,
      acceptedOlQuals: [],
      acceptedAlQuals: [],
      acceptedDegreeStatus: [],
      acceptedGpa: [],
      acceptedDegreeClass: [],
      englishRequirement: '',
      bankProofAndCost: '',
      hookScript: '',
    };
    setRules([...rules, newRule]);
  };

  const handleDeleteCountry = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleAddCustomField = async () => {
    if (!newFieldLabel.trim() || !newFieldOptions.trim()) return;
    const key = `custom_${newFieldLabel.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
    const options = newFieldOptions.split(',').map(o => o.trim()).filter(Boolean);
    const field: CustomField = { key, label: newFieldLabel.trim(), options };
    try {
      await fetch('/api/customfields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field),
      });
      setCustomFields([...customFields, field]);
      setNewFieldLabel('');
      setNewFieldOptions('');
      setShowAddField(false);
    } catch (e) {
      console.error('Failed to add field');
    }
  };

  const handleDeleteCustomField = async (key: string) => {
    await fetch('/api/customfields', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
    setCustomFields(customFields.filter(f => f.key !== key));
  };

  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderQuals = (rule: CountryRule, field: keyof CountryRule, options: string[], title: string, activeBg: string) => {
    const values = (rule[field] as string[]) || [];
    return (
      <div className="mb-5 last:mb-0">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">{title}</p>
        <div className="flex flex-wrap gap-2">
          {options.map(opt => {
            const isAccepted = values.includes(opt);
            return isEditing ? (
              <button
                key={opt}
                onClick={() => toggleQual(rule.id, field, opt)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all flex items-center gap-1.5 ${isAccepted ? activeBg : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300'}`}
              >
                {isAccepted && <Check className="w-3.5 h-3.5" />}
                {opt}
              </button>
            ) : (
              isAccepted && (
                <span key={opt} className={`text-[11px] px-3 py-1 rounded-full font-medium border shadow-sm ${activeBg}`}>
                  {opt}
                </span>
              )
            );
          })}
          {!isEditing && values.length === 0 && (
            <span className="text-xs text-gray-400 italic">Any</span>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Matrix...</div>;

  return (
    <div className="bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Country Rules Matrix</h1>
          <p className="text-sm text-gray-500 mt-1">Live configuration for triage logic and pitch hooks</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search countries..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleAddCountry}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full font-medium text-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Country
              </button>
              <button
                onClick={() => setShowAddField(true)}
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-full font-medium text-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Field
              </button>
              <button onClick={() => setIsEditing(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
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
              <Edit2 className="w-4 h-4" /> Edit Matrix
            </button>
          )}
        </div>
      </div>

      {/* Add Custom Field Form */}
      {showAddField && (
        <div className="mb-6 bg-purple-50 border border-purple-100 rounded-2xl p-5">
          <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Define a New Filter Attribute
          </h3>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Field label (e.g. Work Experience)"
              value={newFieldLabel}
              onChange={e => setNewFieldLabel(e.target.value)}
              className="flex-1 min-w-[180px] bg-white border border-purple-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all shadow-sm"
            />
            <input
              type="text"
              placeholder="Options comma-separated (e.g. None, 1-2 yrs, 3+ yrs)"
              value={newFieldOptions}
              onChange={e => setNewFieldOptions(e.target.value)}
              className="flex-1 min-w-[240px] bg-white border border-purple-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all shadow-sm"
            />
            <button onClick={handleAddCustomField} className="bg-purple-600 shadow-md shadow-purple-600/20 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-all active:scale-95">
              Add Field
            </button>
            <button onClick={() => setShowAddField(false)} className="text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 px-5 py-2 rounded-full text-sm font-medium transition-all">
              Cancel
            </button>
          </div>
          {customFields.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {customFields.map(f => (
                <div key={f.key} className="flex items-center gap-1 bg-white border border-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                  {f.label}
                  <button onClick={() => handleDeleteCustomField(f.key)} className="ml-1 text-red-400 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Matrix Table */}
      <div className="overflow-x-auto pb-10">
        <div className="inline-block min-w-full align-middle">
          <div className="border border-gray-100 rounded-[32px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-[#F8F8F7]">
                <tr>
                  <th scope="col" className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest w-64">Country & Constraints</th>
                  <th scope="col" className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Accepted Qualifications</th>
                  <th scope="col" className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest w-1/4">Counselor Pitch</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100/60">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-[#FDFDFD] transition-colors align-top">
                    {/* Country & Age */}
                    <td className="px-8 py-6 align-top">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={rule.name ?? ''}
                              onChange={(e) => updateRule(rule.id, 'name', e.target.value)}
                              className="font-bold text-gray-900 border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-3 py-2 w-full text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all shadow-sm"
                            />
                            <button onClick={() => handleDeleteCountry(rule.id)} className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2.5 rounded-full shrink-0 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">UG Max Age</span>
                            <input
                              type="number"
                              value={rule.ageLimitUG ?? 30}
                              onChange={(e) => updateRule(rule.id, 'ageLimitUG', parseInt(e.target.value) || 30)}
                              className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all text-center"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-3 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">PG Max Age</span>
                            <input
                              type="number"
                              value={rule.ageLimitPG ?? 40}
                              onChange={(e) => updateRule(rule.id, 'ageLimitPG', parseInt(e.target.value) || 40)}
                              className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all text-center"
                            />
                          </div>
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">English Req</span>
                            <input
                              type="text"
                              value={rule.englishRequirement ?? ''}
                              onChange={(e) => updateRule(rule.id, 'englishRequirement', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all"
                            />
                          </div>
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Funds / Bank Proof</span>
                            <input
                              type="text"
                              value={rule.bankProofAndCost ?? ''}
                              onChange={(e) => updateRule(rule.id, 'bankProofAndCost', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-bold text-gray-900 text-lg mb-3">{rule.name}</div>
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <span className="bg-blue-50/80 text-blue-700 border border-blue-100 text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide">UG &lt; {rule.ageLimitUG}</span>
                              <span className="bg-purple-50/80 text-purple-700 border border-purple-100 text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide">PG &lt; {rule.ageLimitPG}</span>
                            </div>
                            {rule.englishRequirement && (
                              <span className="bg-green-50/80 border border-green-100 text-green-800 text-[11px] px-2.5 py-1 rounded-md w-fit font-medium">En: {rule.englishRequirement}</span>
                            )}
                            {rule.bankProofAndCost && (
                              <span className="bg-slate-50/80 border border-slate-200 text-slate-700 text-[11px] px-2.5 py-1 rounded-md w-fit font-medium">Funds: {rule.bankProofAndCost}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Qualifications */}
                    <td className="px-8 py-6 align-top border-l border-gray-50/50">
                      <div>
                        {renderQuals(rule, 'acceptedOlQuals', OL_OPTIONS, 'O/L Status', 'bg-blue-50 border-blue-200 text-blue-700')}
                        {renderQuals(rule, 'acceptedAlQuals', AL_OPTIONS, 'A/L Result', 'bg-indigo-50 border-indigo-200 text-indigo-700')}
                        {renderQuals(rule, 'acceptedDegreeStatus', DEGREE_OPTIONS, 'Degree Status', 'bg-purple-50 border-purple-200 text-purple-700')}
                        {renderQuals(rule, 'acceptedGpa', GPA_OPTIONS, 'GPA', 'bg-pink-50 border-pink-200 text-pink-700')}
                        {renderQuals(rule, 'acceptedDegreeClass', DEGREE_CLASS_OPTIONS, 'Degree Class', 'bg-rose-50 border-rose-200 text-rose-700')}

                        {/* Custom dynamic fields */}
                        {customFields.map(cf => {
                          const values = rule.customValues?.[cf.key] || [];
                          return (
                            <div key={cf.key} className="mb-5 last:mb-0">
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">{cf.label}</p>
                              <div className="flex flex-wrap gap-2">
                                {cf.options.map(opt => {
                                  const isAccepted = values.includes(opt);
                                  return isEditing ? (
                                    <button
                                      key={opt}
                                      onClick={() => toggleCustomQual(rule.id, cf.key, opt)}
                                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all flex items-center gap-1.5 ${isAccepted ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300'}`}
                                    >
                                      {isAccepted && <Check className="w-3.5 h-3.5" />}
                                      {opt}
                                    </button>
                                  ) : (
                                    isAccepted && (
                                      <span key={opt} className="text-[11px] px-3 py-1 rounded-full font-medium border bg-amber-50 border-amber-200 text-amber-700 shadow-sm">
                                        {opt}
                                      </span>
                                    )
                                  );
                                })}
                                {!isEditing && values.length === 0 && (
                                  <span className="text-xs text-gray-400 italic">Any</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Hook Script */}
                    <td className="px-8 py-6 align-top border-l border-gray-50/50">
                      {isEditing ? (
                        <textarea
                          value={rule.hookScript ?? ''}
                          onChange={(e) => updateRule(rule.id, 'hookScript', e.target.value)}
                          className="w-full h-32 text-sm border border-blue-200 bg-blue-50/50 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none resize-none transition-all shadow-inner"
                          placeholder="Enter counselor pitch script..."
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-blue-50/80 to-blue-50/30 border border-blue-100/80 rounded-2xl p-4 relative group shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                          <Info className="w-4 h-4 text-blue-400 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <p className="text-blue-900/90 text-[13px] italic leading-relaxed pr-6 font-medium">
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

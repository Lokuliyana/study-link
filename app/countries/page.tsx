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

  const renderQuals = (
    rule: CountryRule,
    field: string,
    options: string[],
    title: string,
    activeBg: string
  ) => {
    const values = (rule[field as keyof CountryRule] as string[]) || [];
    return (
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
        <div className="flex flex-wrap gap-1.5">
          {options.map(opt => {
            const isAccepted = values.includes(opt);
            return isEditing ? (
              <button
                key={opt}
                onClick={() => toggleQual(rule.id, field, opt)}
                className={`px-2 py-1 rounded text-xs font-medium border transition-colors flex items-center gap-1 ${isAccepted ? activeBg : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
              >
                {isAccepted && <Check className="w-3 h-3" />}
                {opt}
              </button>
            ) : (
              isAccepted && (
                <span key={opt} className={`text-[11px] px-2 py-0.5 rounded font-medium border ${activeBg}`}>
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
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Define a New Filter Attribute
          </h3>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Field label (e.g. Work Experience)"
              value={newFieldLabel}
              onChange={e => setNewFieldLabel(e.target.value)}
              className="flex-1 min-w-[180px] border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Options comma-separated (e.g. None, 1-2 yrs, 3+ yrs)"
              value={newFieldOptions}
              onChange={e => setNewFieldOptions(e.target.value)}
              className="flex-1 min-w-[240px] border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
            <button onClick={handleAddCustomField} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
              Add
            </button>
            <button onClick={() => setShowAddField(false)} className="text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm transition-colors">
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
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-gray-900 w-48">Country & Age</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-gray-900">Accepted Qualifications</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold text-gray-900 w-1/4">Hook Script</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50/50 transition-colors align-top">
                    {/* Country & Age */}
                    <td className="px-6 py-5 align-top">
                      {isEditing ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={rule.name ?? ''}
                              onChange={(e) => updateRule(rule.id, 'name', e.target.value)}
                              className="font-bold text-gray-900 border rounded px-2 py-1 w-full text-sm"
                            />
                            <button onClick={() => handleDeleteCountry(rule.id)} className="text-red-400 hover:text-red-600 p-1 shrink-0">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">UG Max Age</span>
                            <input
                              type="number"
                              value={rule.ageLimitUG ?? 30}
                              onChange={(e) => updateRule(rule.id, 'ageLimitUG', parseInt(e.target.value) || 30)}
                              className="w-16 border rounded px-1.5 py-1 text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">PG Max Age</span>
                            <input
                              type="number"
                              value={rule.ageLimitPG ?? 40}
                              onChange={(e) => updateRule(rule.id, 'ageLimitPG', parseInt(e.target.value) || 40)}
                              className="w-16 border rounded px-1.5 py-1 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-gray-600">English Req</span>
                            <input
                              type="text"
                              value={rule.englishRequirement ?? ''}
                              onChange={(e) => updateRule(rule.id, 'englishRequirement', e.target.value)}
                              className="w-full border rounded px-2 py-1 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-gray-600">Funds / Bank Proof</span>
                            <input
                              type="text"
                              value={rule.bankProofAndCost ?? ''}
                              onChange={(e) => updateRule(rule.id, 'bankProofAndCost', e.target.value)}
                              className="w-full border rounded px-2 py-1 text-xs"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-bold text-gray-900 text-base mb-2">{rule.name}</div>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                              <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs px-2 py-0.5 rounded font-medium">UG &lt; {rule.ageLimitUG}</span>
                              <span className="bg-purple-50 text-purple-700 border border-purple-100 text-xs px-2 py-0.5 rounded font-medium">PG &lt; {rule.ageLimitPG}</span>
                            </div>
                            {rule.englishRequirement && (
                              <span className="bg-green-50 border border-green-100 text-green-700 text-[11px] px-2 py-0.5 rounded w-fit">{rule.englishRequirement}</span>
                            )}
                            {rule.bankProofAndCost && (
                              <span className="bg-blue-50 border border-blue-100 text-blue-700 text-[11px] px-2 py-0.5 rounded w-fit">{rule.bankProofAndCost}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Qualifications */}
                    <td className="px-6 py-5 align-top">
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
                            <div key={cf.key} className="mb-4">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{cf.label}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {cf.options.map(opt => {
                                  const isAccepted = values.includes(opt);
                                  return isEditing ? (
                                    <button
                                      key={opt}
                                      onClick={() => toggleCustomQual(rule.id, cf.key, opt)}
                                      className={`px-2 py-1 rounded text-xs font-medium border transition-colors flex items-center gap-1 ${isAccepted ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                                    >
                                      {isAccepted && <Check className="w-3 h-3" />}
                                      {opt}
                                    </button>
                                  ) : (
                                    isAccepted && (
                                      <span key={opt} className="text-[11px] px-2 py-0.5 rounded font-medium border bg-amber-50 border-amber-200 text-amber-700">
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
                    <td className="px-6 py-5 align-top">
                      {isEditing ? (
                        <textarea
                          value={rule.hookScript ?? ''}
                          onChange={(e) => updateRule(rule.id, 'hookScript', e.target.value)}
                          className="w-full h-32 text-sm border border-blue-300 bg-blue-50/30 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                          placeholder="Enter counselor pitch script..."
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

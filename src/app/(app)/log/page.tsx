'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getActivities, addActivity, deleteActivity } from '@/ui/store';
import { ACTIVITY_SUBTYPES, CATEGORY_CONFIG } from '@/backend/constants';
import { calculateEmission } from '@/backend/emissions';
import { Activity, ActivityCategory } from '@/types';

export default function LogPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('transport');
  const [selectedSubtype, setSelectedSubtype] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [filterCat, setFilterCat] = useState<ActivityCategory | 'all'>('all');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    setActivities(getActivities());
  }, []);

  const subtypes = useMemo(
    () => ACTIVITY_SUBTYPES.filter((s) => s.category === selectedCategory),
    [selectedCategory]
  );

  useEffect(() => {
    if (subtypes.length > 0 && !subtypes.find((s) => s.id === selectedSubtype)) {
      setSelectedSubtype(subtypes[0].id);
      setValue(String(subtypes[0].defaultValue));
    }
  }, [subtypes, selectedSubtype]);

  const preview = useMemo(() => {
    if (!selectedSubtype || !value) return 0;
    return calculateEmission(selectedSubtype, parseFloat(value) || 0);
  }, [selectedSubtype, value]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubtype || !value || !date) return;
    const newAct = addActivity({
      category: selectedCategory,
      subtypeId: selectedSubtype,
      value: parseFloat(value),
      date,
      note: note || undefined,
    });
    setActivities((prev) => [...prev, newAct]);
    setValue(String(subtypes.find((s) => s.id === selectedSubtype)?.defaultValue || ''));
    setNote('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  }, [selectedCategory, selectedSubtype, value, date, note, subtypes]);

  const handleDelete = useCallback((id: string) => {
    deleteActivity(id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const filteredActivities = useMemo(() => {
    const sorted = [...activities].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (filterCat === 'all') return sorted;
    return sorted.filter((a) => a.category === filterCat);
  }, [activities, filterCat]);

  if (!mounted) return <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;

  const currentSubtype = ACTIVITY_SUBTYPES.find((s) => s.id === selectedSubtype);

  return (
    <div>
      <div className="page-header">
        <h1>Log Activity</h1>
        <p>Record your daily activities and see their carbon impact</p>
      </div>

      {showSuccess && (
        <div style={{
          background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 'var(--radius-md)', padding: '12px 20px', marginBottom: 20,
          color: '#10B981', fontSize: '0.88rem', animation: 'slideUp 0.3s ease'
        }}>
          ✅ Activity logged! {preview} kg CO₂ added.
        </div>
      )}

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        {/* Log Form */}
        <div className="card animate-in">
          <div className="card-header"><h3>New Activity</h3></div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(Object.keys(CATEGORY_CONFIG) as ActivityCategory[]).map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    className={`chip chip-${cat} ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                    style={selectedCategory === cat ? { transform: 'scale(1.05)', boxShadow: `0 0 12px ${CATEGORY_CONFIG[cat].color}40` } : {}}
                  >
                    {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="subtype-select">Activity Type</label>
              <select
                id="subtype-select"
                className="form-select"
                value={selectedSubtype}
                onChange={(e) => {
                  setSelectedSubtype(e.target.value);
                  const st = subtypes.find((s) => s.id === e.target.value);
                  if (st) setValue(String(st.defaultValue));
                }}
              >
                {subtypes.map((s) => (
                  <option key={s.id} value={s.id}>{s.icon} {s.label} ({s.emissionFactor} kg CO₂/{s.unit})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="value-input">Amount ({currentSubtype?.unit || 'unit'})</label>
                <input
                  id="value-input"
                  type="number"
                  className="form-input"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  min="0"
                  step="0.1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="date-input">Date</label>
                <input
                  id="date-input"
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="note-input">Note (optional)</label>
              <textarea
                id="note-input"
                className="form-textarea"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="E.g., Commute to office"
                maxLength={500}
              />
            </div>

            {/* Preview */}
            <div style={{
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
              padding: '16px 20px', marginBottom: 20, display: 'flex',
              alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Estimated CO₂ Impact</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: preview > 5 ? '#EF4444' : preview > 2 ? '#F59E0B' : '#10B981' }}>
                {preview.toFixed(2)} <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>kg CO₂</span>
              </span>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" id="submit-activity">
              📝 Log Activity
            </button>
          </form>
        </div>

        {/* Activity History */}
        <div className="card animate-in">
          <div className="card-header">
            <h3>Activity History ({filteredActivities.length})</h3>
          </div>
          <div className="filters-row">
            <button className={`chip ${filterCat === 'all' ? 'active' : ''}`} onClick={() => setFilterCat('all')}
              style={filterCat === 'all' ? { background: 'var(--primary-surface)', color: 'var(--primary-light)' } : { background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
              All
            </button>
            {(Object.keys(CATEGORY_CONFIG) as ActivityCategory[]).map((cat) => (
              <button key={cat} className={`chip chip-${cat} ${filterCat === cat ? 'active' : ''}`} onClick={() => setFilterCat(cat)}>
                {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
              </button>
            ))}
          </div>

          <div style={{ maxHeight: 450, overflowY: 'auto' }}>
            {filteredActivities.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3>No activities found</h3>
              </div>
            ) : (
              filteredActivities.slice(0, 20).map((act) => {
                const cat = CATEGORY_CONFIG[act.category];
                return (
                  <div key={act.id} className="activity-item" style={{ paddingRight: 8 }}>
                    <div className="activity-item-icon" style={{ background: `${cat.color}20` }}>{cat.icon}</div>
                    <div className="activity-item-info">
                      <h4>{act.subtypeId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</h4>
                      <span>{act.value} {act.unit} • {act.date}</span>
                    </div>
                    <div className="activity-item-co2" style={{ color: cat.color, marginRight: 8 }}>{act.co2Amount.toFixed(1)} kg</div>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(act.id)} aria-label={`Delete activity ${act.subtypeId}`}>🗑️</button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { getActivities } from '@/ui/store';
import { groupActivitiesByDate, getCategoryBreakdown, getTotalCo2, getDailyAverage } from '@/backend/emissions';
import { CATEGORY_CONFIG, AVERAGES } from '@/backend/constants';
import { Activity } from '@/types';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export default function AnalyticsPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    setMounted(true);
    setActivities(getActivities());
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    if (period === 'week') {
      const w = new Date(now); w.setDate(w.getDate() - 7);
      return activities.filter((a) => a.date >= w.toISOString().slice(0, 10));
    }
    if (period === 'month') {
      const m = new Date(now); m.setDate(m.getDate() - 30);
      return activities.filter((a) => a.date >= m.toISOString().slice(0, 10));
    }
    return activities;
  }, [activities, period]);

  const dailyData = useMemo(() => groupActivitiesByDate(filtered), [filtered]);
  const breakdown = useMemo(() => getCategoryBreakdown(filtered), [filtered]);
  const total = useMemo(() => getTotalCo2(filtered), [filtered]);
  const avg = useMemo(() => getDailyAverage(filtered), [filtered]);

  if (!mounted) return <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;


  return (
    <div>
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Deep dive into your carbon footprint patterns</p>
      </div>

      <div className="tabs">
        {(['week', 'month', 'all'] as const).map((p) => (
          <button key={p} className={`tab-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
            {p === 'week' ? '7 Days' : p === 'month' ? '30 Days' : 'All Time'}
          </button>
        ))}
      </div>

      <div className="grid grid-4 stagger" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>🌡️</div>
          <div className="stat-info"><h4>Total CO₂</h4><div><span className="stat-value">{total.toFixed(0)}</span><span className="stat-unit">kg</span></div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(14,165,233,0.15)' }}>📊</div>
          <div className="stat-info"><h4>Daily Avg</h4><div><span className="stat-value">{avg.toFixed(1)}</span><span className="stat-unit">kg/day</span></div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>📝</div>
          <div className="stat-info"><h4>Activities</h4><div><span className="stat-value">{filtered.length}</span><span className="stat-unit">logged</span></div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: avg < AVERAGES.india ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}>
            {avg < AVERAGES.india ? '🎉' : '⚠️'}
          </div>
          <div className="stat-info"><h4>vs India Avg</h4><div><span className="stat-value" style={{ color: avg < AVERAGES.india ? '#10B981' : '#EF4444' }}>{avg < AVERAGES.india ? 'Below' : 'Above'}</span></div></div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        {/* Stacked Area Chart */}
        <div className="card animate-in">
          <div className="card-header"><h3>Daily Emissions by Category</h3></div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={dailyData}>
                <defs>
                  {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                    <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={cfg.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <XAxis dataKey="date" tickFormatter={(d: string) => d.slice(5)} />
                <YAxis width={40} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #f0f0f0', borderRadius: 8, fontSize: '0.82rem', color: '#000000' }} />
                <Legend />
                {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                  <Area key={key} type="monotone" dataKey={key} stroke={cfg.color} fill={`url(#grad-${key})`} strokeWidth={2} stackId="1" />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="card animate-in">
          <div className="card-header"><h3>Category Distribution</h3></div>
          <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={breakdown} dataKey="total" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} label={({ percent }: { percent?: number }) => `${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {breakdown.map((entry) => <Cell key={entry.category} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #f0f0f0', borderRadius: 8, fontSize: '0.82rem', color: '#000000' }} formatter={(val: unknown) => [`${(val as number).toFixed(1)} kg CO₂`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <div className="card-header"><h3>How You Compare</h3></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { label: 'You', value: avg, color: '#10B981' },
            { label: 'India Avg', value: AVERAGES.india, color: '#0EA5E9' },
            { label: 'Global Avg', value: AVERAGES.global, color: '#F59E0B' },
            { label: 'USA Avg', value: AVERAGES.usa, color: '#EF4444' },
          ].map((item) => (
            <div key={item.label} className="comparison-bar-container">
              <div className="comparison-label">
                <span>{item.label}</span>
                <span style={{ fontWeight: 600 }}>{item.value.toFixed(1)} kg CO₂/day</span>
              </div>
              <div className="comparison-bar">
                <div className="comparison-fill" style={{ width: `${Math.min((item.value / AVERAGES.usa) * 100, 100)}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart by Day of Week */}
      <div className="card animate-in">
        <div className="card-header"><h3>Emissions by Day</h3></div>
        <div style={{ height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={dailyData.slice(-14)}>
              <XAxis dataKey="date" tickFormatter={(d: string) => { const day = new Date(d).toLocaleDateString('en', { weekday: 'short' }); return `${day} ${d.slice(8)}`; }} />
              <YAxis width={40} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #f0f0f0', borderRadius: 8, fontSize: '0.82rem', color: '#000000' }} formatter={(val: unknown) => [`${(val as number).toFixed(1)} kg`, '']} />
              <Bar dataKey="total" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

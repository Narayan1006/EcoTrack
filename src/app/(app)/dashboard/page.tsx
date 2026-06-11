"use client";

import { useState, useEffect, useMemo } from "react";
import { getActivities } from "@/ui/store";
import {
  groupActivitiesByDate,
  getCategoryBreakdown,
  getTotalCo2,
  getDailyAverage,
} from "@/backend/emissions";
import { CATEGORY_CONFIG, AVERAGES } from "@/backend/constants";
import { Activity } from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

function CarbonGauge({ value, max }: { value: number; max: number }) {
  const pct = Math.min(value / max, 1);
  const angle = pct * 180;
  const color = pct < 0.5 ? "#10B981" : pct < 0.8 ? "#F59E0B" : "#EF4444";

  return (
    <div className="gauge-container">
      <svg className="gauge-svg" viewBox="0 0 200 110">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#334155"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${angle * 2.79} 999`}
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
            transition: "all 1s ease",
          }}
        />
        <circle
          cx={100 + 80 * Math.cos(Math.PI - (angle * Math.PI) / 180)}
          cy={100 - 80 * Math.sin(Math.PI - (angle * Math.PI) / 180)}
          r="6"
          fill={color}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="gauge-value" style={{ color }}>
        {value.toFixed(1)}
      </div>
      <div className="gauge-label">kg CO₂ today</div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  bgColor,
}: {
  icon: string;
  label: string;
  value: string;
  unit: string;
  bgColor: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bgColor }}>
        {icon}
      </div>
      <div className="stat-info">
        <h4>{label}</h4>
        <div>
          <span className="stat-value">{value}</span>
          <span className="stat-unit">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setActivities(getActivities());
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayActivities = useMemo(
    () => activities.filter((a) => a.date === today),
    [activities, today],
  );
  const todayCo2 = useMemo(
    () => getTotalCo2(todayActivities),
    [todayActivities],
  );
  const dailyAvg = useMemo(() => getDailyAverage(activities), [activities]);
  const weeklyData = useMemo(
    () => groupActivitiesByDate(activities).slice(-7),
    [activities],
  );
  const breakdown = useMemo(
    () => getCategoryBreakdown(activities),
    [activities],
  );
  const totalCo2 = useMemo(() => getTotalCo2(activities), [activities]);
  const recentActivities = useMemo(
    () =>
      [...activities]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [activities],
  );

  if (!mounted)
    return (
      <div
        className="animate-pulse"
        style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}
      >
        Loading...
      </div>
    );

  return (
    <div>
      <div className="demo-banner">
        <span>⚡</span>
        <span>
          Running in demo mode with sample data. Connect Firebase & Gemini API
          for full functionality.
        </span>
      </div>

      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your carbon footprint at a glance</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-4 stagger" style={{ marginBottom: 24 }}>
        <StatCard
          icon="🌡️"
          label="Today's Footprint"
          value={todayCo2.toFixed(1)}
          unit="kg CO₂"
          bgColor="rgba(16,185,129,0.15)"
        />
        <StatCard
          icon="📊"
          label="Daily Average"
          value={dailyAvg.toFixed(1)}
          unit="kg CO₂"
          bgColor="rgba(14,165,233,0.15)"
        />
        <StatCard
          icon="🌍"
          label="Total Tracked"
          value={totalCo2.toFixed(0)}
          unit="kg CO₂"
          bgColor="rgba(245,158,11,0.15)"
        />
        <StatCard
          icon="📝"
          label="Activities"
          value={String(activities.length)}
          unit="logged"
          bgColor="rgba(162,155,254,0.15)"
        />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        {/* Gauge Card */}
        <div className="card animate-in">
          <div className="card-header">
            <h3>Today&apos;s Carbon Score</h3>
            <Link href="/log" className="btn btn-primary btn-sm">
              + Log Activity
            </Link>
          </div>
          <CarbonGauge value={todayCo2} max={AVERAGES.global} />
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Global avg: {AVERAGES.global} kg • India avg: {AVERAGES.india} kg
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card animate-in">
          <div className="card-header">
            <h3>Category Breakdown</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 160, height: 160 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="total"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {breakdown.map((entry) => (
                      <Cell key={entry.category} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                      fontSize: "0.82rem",
                      color: "#000000",
                    }}
                    formatter={(val: unknown) => [
                      `${(val as number).toFixed(1)} kg`,
                      "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {breakdown.map((b) => (
                <div
                  key={b.category}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: b.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "0.85rem", flex: 1 }}>
                    {CATEGORY_CONFIG[b.category].icon}{" "}
                    {CATEGORY_CONFIG[b.category].label}
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    {b.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Weekly Trend */}
        <div className="card animate-in">
          <div className="card-header">
            <h3>Weekly Trend</h3>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="grd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(d: string) => d.slice(5)}
                />
                <YAxis width={40} tickFormatter={(v: number) => `${v}`} />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #f0f0f0",
                    borderRadius: 8,
                    fontSize: "0.82rem",
                    color: "#000000",
                  }}
                  formatter={(val: unknown) => [
                    `${(val as number).toFixed(1)} kg CO₂`,
                    "Total",
                  ]}
                  labelFormatter={(l: unknown) => `Date: ${l}`}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#10B981"
                  fill="url(#grd)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card animate-in">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <Link href="/log" className="btn btn-ghost btn-sm">
              View All →
            </Link>
          </div>
          {recentActivities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No activities yet</h3>
              <p>Start logging to track your footprint</p>
            </div>
          ) : (
            <div>
              {recentActivities.map((act) => {
                const cat = CATEGORY_CONFIG[act.category];
                return (
                  <div key={act.id} className="activity-item">
                    <div
                      className="activity-item-icon"
                      style={{ background: `${cat.color}20` }}
                    >
                      {cat.icon}
                    </div>
                    <div className="activity-item-info">
                      <h4>
                        {act.subtypeId
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </h4>
                      <span>
                        {act.value} {act.unit} • {act.date}
                      </span>
                    </div>
                    <div
                      className="activity-item-co2"
                      style={{ color: cat.color }}
                    >
                      {act.co2Amount.toFixed(1)} kg
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card animate-in" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h3>Quick Log</h3>
        </div>
        <div className="quick-actions-grid">
          {[
            { icon: "🚗", label: "Car Trip", href: "/log?subtype=car-petrol" },
            { icon: "🚌", label: "Bus Ride", href: "/log?subtype=bus" },
            { icon: "🥗", label: "Veg Meal", href: "/log?subtype=vegetarian" },
            { icon: "🥩", label: "Meat Meal", href: "/log?subtype=meat-heavy" },
            {
              icon: "💡",
              label: "Electricity",
              href: "/log?subtype=electricity",
            },
            { icon: "☕", label: "Coffee", href: "/log?subtype=coffee" },
            {
              icon: "📦",
              label: "Online Order",
              href: "/log?subtype=online-order",
            },
            {
              icon: "🏍️",
              label: "Motorcycle",
              href: "/log?subtype=motorcycle",
            },
          ].map((qa) => (
            <Link key={qa.label} href={qa.href} className="quick-action-btn">
              <span className="qa-icon">{qa.icon}</span>
              {qa.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

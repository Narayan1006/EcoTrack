"use client";

import { useState, useEffect, useMemo } from "react";
import { getEcoActions, toggleEcoAction } from "@/ui/store";
import { CATEGORY_CONFIG } from "@/backend/constants";
import { EcoAction, ActivityCategory } from "@/types";

export default function ActionsPage() {
  const [actions, setActions] = useState<EcoAction[]>([]);
  const [mounted, setMounted] = useState(false);
  const [filterCat, setFilterCat] = useState<ActivityCategory | "all">("all");
  const [filterImpact, setFilterImpact] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  useEffect(() => {
    setMounted(true);
    setActions(getEcoActions());
  }, []);

  const filtered = useMemo(() => {
    let result = actions;
    if (filterCat !== "all")
      result = result.filter((a) => a.category === filterCat);
    if (filterImpact !== "all")
      result = result.filter((a) => a.impact === filterImpact);
    return result;
  }, [actions, filterCat, filterImpact]);

  const handleToggle = (id: string) => {
    toggleEcoAction(id);
    setActions(getEcoActions());
  };

  if (!mounted)
    return (
      <div
        style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}
      >
        Loading...
      </div>
    );

  const completedCount = actions.filter((a) => a.isCompleted).length;
  const totalSavings = actions
    .filter((a) => a.isCompleted)
    .reduce((s, a) => s + a.co2Savings, 0);

  return (
    <div>
      <div className="page-header">
        <h1>Eco Actions Library</h1>
        <p>Discover impactful ways to reduce your carbon footprint</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-3 stagger" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(16,185,129,0.15)" }}
          >
            🌱
          </div>
          <div className="stat-info">
            <h4>Completed</h4>
            <div>
              <span className="stat-value">{completedCount}</span>
              <span className="stat-unit">/ {actions.length}</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(14,165,233,0.15)" }}
          >
            💨
          </div>
          <div className="stat-info">
            <h4>CO₂ Saved</h4>
            <div>
              <span className="stat-value">
                {totalSavings.toLocaleString()}
              </span>
              <span className="stat-unit">kg/year</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(245,158,11,0.15)" }}
          >
            🌳
          </div>
          <div className="stat-info">
            <h4>Trees Equivalent</h4>
            <div>
              <span className="stat-value">
                {Math.round(totalSavings / 22)}
              </span>
              <span className="stat-unit">trees</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-row">
        <span
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            marginRight: 8,
          }}
        >
          Category:
        </span>
        <button
          className={`chip ${filterCat === "all" ? "active" : ""}`}
          onClick={() => setFilterCat("all")}
          style={
            filterCat === "all"
              ? {
                  background: "var(--primary-surface)",
                  color: "var(--primary-light)",
                }
              : {
                  background: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                }
          }
        >
          All
        </button>
        {(Object.keys(CATEGORY_CONFIG) as ActivityCategory[]).map((cat) => (
          <button
            key={cat}
            className={`chip chip-${cat} ${filterCat === cat ? "active" : ""}`}
            onClick={() => setFilterCat(cat)}
          >
            {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
          </button>
        ))}

        <span
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            marginLeft: 16,
            marginRight: 8,
          }}
        >
          Impact:
        </span>
        {(["all", "high", "medium", "low"] as const).map((imp) => (
          <button
            key={imp}
            className={`chip ${filterImpact === imp ? "active" : ""}`}
            onClick={() => setFilterImpact(imp)}
            style={
              filterImpact === imp
                ? {
                    background: "var(--primary-surface)",
                    color: "var(--primary-light)",
                  }
                : {
                    background: "var(--bg-elevated)",
                    color: "var(--text-secondary)",
                  }
            }
          >
            {imp === "all" ? "All" : imp.charAt(0).toUpperCase() + imp.slice(1)}
          </button>
        ))}
      </div>

      {/* Actions Grid */}
      <div className="grid grid-2 stagger">
        {filtered.map((action) => (
          <div
            key={action.id}
            className={`action-card ${action.isCompleted ? "completed" : ""}`}
          >
            <div
              className="action-icon-wrapper"
              style={{
                background: `${CATEGORY_CONFIG[action.category].color}20`,
              }}
            >
              {action.icon}
            </div>
            <div className="action-content">
              <h4>
                {action.isCompleted ? "✅ " : ""}
                {action.title}
              </h4>
              <p>{action.description}</p>
              <div className="action-meta">
                <span className={`action-tag ${action.impact}`}>
                  {action.impact} impact
                </span>
                <span className="action-tag">{action.difficulty}</span>
                <span
                  className="action-tag"
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    color: "#10B981",
                  }}
                >
                  -{action.co2Savings} kg/yr
                </span>
              </div>
            </div>
            <button
              className={`btn ${action.isCompleted ? "btn-danger btn-sm" : "btn-primary btn-sm"}`}
              onClick={() => handleToggle(action.id)}
              aria-label={`Mark ${action.title} as ${action.isCompleted ? "incomplete" : "complete"}`}
            >
              {action.isCompleted ? "Undo" : "Done"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

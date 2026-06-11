"use client";

import { useState, useEffect, useCallback } from "react";
import { getGoals, addGoal, deleteGoal, getBadges } from "@/ui/store";
import { Goal, Badge } from "@/types";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("200");
  const [month, setMonth] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    setMounted(true);
    setGoals(getGoals());
    setBadges(getBadges());
  }, []);

  const handleAddGoal = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title || !target || !month) return;
      const g = addGoal({ title, targetCo2: parseFloat(target), month });
      setGoals((prev) => [...prev, g]);
      setTitle("");
      setTarget("200");
      setShowForm(false);
    },
    [title, target, month],
  );

  const handleDeleteGoal = useCallback((id: string) => {
    deleteGoal(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  if (!mounted)
    return (
      <div
        style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}
      >
        Loading...
      </div>
    );

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div>
      <div className="page-header">
        <h1>Goals & Achievements</h1>
        <p>Set targets and earn badges for your climate actions</p>
      </div>

      {/* Goals Section */}
      <div className="card animate-in" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3>🎯 Monthly Goals</h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ New Goal"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleAddGoal}
            style={{
              marginBottom: 20,
              padding: 20,
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div className="grid grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="goal-title">
                  Goal Title
                </label>
                <input
                  id="goal-title"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Reduce monthly carbon"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="goal-target">
                  Target (kg CO₂)
                </label>
                <input
                  id="goal-target"
                  type="number"
                  className="form-input"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="goal-month">
                  Month
                </label>
                <input
                  id="goal-month"
                  type="month"
                  className="form-input"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" id="submit-goal">
              Create Goal
            </button>
          </form>
        )}

        {goals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎯</div>
            <h3>No goals yet</h3>
            <p>Set a monthly carbon reduction target to get started!</p>
          </div>
        ) : (
          <div className="grid grid-2 stagger">
            {goals.map((goal) => {
              const pct =
                goal.targetCo2 > 0
                  ? Math.min((goal.currentCo2 / goal.targetCo2) * 100, 100)
                  : 0;
              const isOverBudget = goal.currentCo2 > goal.targetCo2;
              return (
                <div
                  key={goal.id}
                  className="card"
                  style={{
                    border: goal.isCompleted
                      ? "1px solid var(--primary)"
                      : undefined,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: "1rem", marginBottom: 4 }}>
                        {goal.isCompleted ? "✅" : "🎯"} {goal.title}
                      </h4>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {goal.month}
                      </span>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDeleteGoal(goal.id)}
                      aria-label="Delete goal"
                    >
                      🗑️
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.85rem",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        color: isOverBudget
                          ? "#EF4444"
                          : "var(--text-secondary)",
                      }}
                    >
                      {goal.currentCo2.toFixed(0)} kg used
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {goal.targetCo2} kg target
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${isOverBudget ? "warning" : ""}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      fontSize: "0.78rem",
                      color: "var(--text-muted)",
                      marginTop: 4,
                    }}
                  >
                    {pct.toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Badges Section */}
      <div className="card animate-in">
        <div className="card-header">
          <h3>🏆 Achievements</h3>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {unlockedCount}/{badges.length} unlocked
          </span>
        </div>
        <div
          className="grid grid-4 stagger"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          }}
        >
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`badge-item ${badge.isUnlocked ? "unlocked" : "locked"}`}
            >
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-title">{badge.title}</div>
              <div className="badge-desc">{badge.description}</div>
              {badge.isUnlocked && badge.unlockedAt && (
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--primary)",
                    marginTop: 4,
                  }}
                >
                  ✓ {new Date(badge.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

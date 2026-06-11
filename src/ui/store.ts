// ============================================================================
// EcoTrack — Client-side Data Store with localStorage persistence
// Provides a unified API that works in demo mode (localStorage)
// and can be swapped to Firebase when configured
// ============================================================================

"use client";

import { Activity, Goal, Badge, EcoAction } from "@/types";
import { ECO_ACTIONS } from "@/backend/constants";
import {
  generateMockActivities,
  generateMockGoals,
  generateMockBadges,
} from "@/backend/mock-data";
import { calculateEmission, getUnitForSubtype } from "@/backend/emissions";
import { v4 as uuid } from "uuid";

const STORAGE_KEYS = {
  activities: "ecotrack_activities",
  goals: "ecotrack_goals",
  badges: "ecotrack_badges",
  ecoActions: "ecotrack_eco_actions",
  initialized: "ecotrack_initialized",
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.warn("Failed to save to localStorage");
  }
}

/**
 * Initialize the store with mock data if running for the first time.
 */
export function initializeStore(): void {
  if (typeof window === "undefined") return;
  const initialized = localStorage.getItem(STORAGE_KEYS.initialized);
  if (initialized) return;

  saveToStorage(STORAGE_KEYS.activities, generateMockActivities());
  saveToStorage(STORAGE_KEYS.goals, generateMockGoals());
  saveToStorage(STORAGE_KEYS.badges, generateMockBadges());
  saveToStorage(STORAGE_KEYS.ecoActions, ECO_ACTIONS);
  localStorage.setItem(STORAGE_KEYS.initialized, "true");
}

// ---------------------------------------------------------------------------
// Activities CRUD
// ---------------------------------------------------------------------------
export function getActivities(): Activity[] {
  return loadFromStorage<Activity[]>(STORAGE_KEYS.activities, []);
}

export function addActivity(input: {
  category: Activity["category"];
  subtypeId: string;
  value: number;
  date: string;
  note?: string;
}): Activity {
  const activities = getActivities();
  const newActivity: Activity = {
    id: uuid(),
    category: input.category,
    subtypeId: input.subtypeId,
    value: input.value,
    unit: getUnitForSubtype(input.subtypeId),
    co2Amount: calculateEmission(input.subtypeId, input.value),
    date: input.date,
    note: input.note,
    createdAt: new Date().toISOString(),
  };
  activities.push(newActivity);
  saveToStorage(STORAGE_KEYS.activities, activities);
  return newActivity;
}

export function deleteActivity(id: string): void {
  const activities = getActivities().filter((a) => a.id !== id);
  saveToStorage(STORAGE_KEYS.activities, activities);
}

// ---------------------------------------------------------------------------
// Goals CRUD
// ---------------------------------------------------------------------------
export function getGoals(): Goal[] {
  return loadFromStorage<Goal[]>(STORAGE_KEYS.goals, []);
}

export function addGoal(input: {
  title: string;
  targetCo2: number;
  month: string;
}): Goal {
  const goals = getGoals();
  const newGoal: Goal = {
    id: uuid(),
    title: input.title,
    targetCo2: input.targetCo2,
    currentCo2: 0,
    month: input.month,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  };
  goals.push(newGoal);
  saveToStorage(STORAGE_KEYS.goals, goals);
  return newGoal;
}

export function updateGoalProgress(goalId: string, currentCo2: number): void {
  const goals = getGoals();
  const goal = goals.find((g) => g.id === goalId);
  if (goal) {
    goal.currentCo2 = currentCo2;
    goal.isCompleted = currentCo2 <= goal.targetCo2;
    saveToStorage(STORAGE_KEYS.goals, goals);
  }
}

export function deleteGoal(id: string): void {
  const goals = getGoals().filter((g) => g.id !== id);
  saveToStorage(STORAGE_KEYS.goals, goals);
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------
export function getBadges(): Badge[] {
  return loadFromStorage<Badge[]>(STORAGE_KEYS.badges, []);
}

export function unlockBadge(badgeId: string): void {
  const badges = getBadges();
  const badge = badges.find((b) => b.id === badgeId);
  if (badge && !badge.isUnlocked) {
    badge.isUnlocked = true;
    badge.unlockedAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.badges, badges);
  }
}

// ---------------------------------------------------------------------------
// Eco Actions
// ---------------------------------------------------------------------------
export function getEcoActions(): EcoAction[] {
  return loadFromStorage<EcoAction[]>(STORAGE_KEYS.ecoActions, ECO_ACTIONS);
}

export function toggleEcoAction(actionId: string): void {
  const actions = getEcoActions();
  const action = actions.find((a) => a.id === actionId);
  if (action) {
    action.isCompleted = !action.isCompleted;
    saveToStorage(STORAGE_KEYS.ecoActions, actions);
  }
}

// ---------------------------------------------------------------------------
// Reset (for development)
// ---------------------------------------------------------------------------
export function resetStore(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  initializeStore();
}

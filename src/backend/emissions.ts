// ============================================================================
// EcoTrack — CO₂ Emission Calculation Engine
// ============================================================================

import { ACTIVITY_SUBTYPES } from "./constants";
import type {
  Activity,
  ActivityCategory,
  DailyTotal,
  CategoryBreakdown,
} from "@/types";

/**
 * Calculate CO₂ emissions for a given activity subtype and quantity.
 * @returns CO₂ in kg, rounded to 2 decimal places
 */
export function calculateEmission(subtypeId: string, value: number): number {
  const subtype = ACTIVITY_SUBTYPES.find((s) => s.id === subtypeId);
  if (!subtype) throw new Error(`Unknown activity subtype: ${subtypeId}`);
  return Math.round(subtype.emissionFactor * value * 100) / 100;
}

/**
 * Get the unit label for a given activity subtype.
 */
export function getUnitForSubtype(subtypeId: string): string {
  const subtype = ACTIVITY_SUBTYPES.find((s) => s.id === subtypeId);
  return subtype?.unit ?? "unit";
}

/**
 * Group activities by date and sum CO₂ totals per category.
 */
export function groupActivitiesByDate(activities: Activity[]): DailyTotal[] {
  const map = new Map<string, DailyTotal>();

  for (const act of activities) {
    const existing = map.get(act.date) ?? {
      date: act.date,
      total: 0,
      transport: 0,
      food: 0,
      energy: 0,
      shopping: 0,
    };
    existing.total += act.co2Amount;
    existing[act.category] += act.co2Amount;
    map.set(act.date, existing);
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

/**
 * Calculate category breakdown with percentages.
 */
export function getCategoryBreakdown(
  activities: Activity[],
): CategoryBreakdown[] {
  const totals: Record<ActivityCategory, number> = {
    transport: 0,
    food: 0,
    energy: 0,
    shopping: 0,
  };

  for (const act of activities) {
    totals[act.category] += act.co2Amount;
  }

  const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0);

  const colors: Record<ActivityCategory, string> = {
    transport: "#4ECDC4",
    food: "#FF6B6B",
    energy: "#FECA57",
    shopping: "#A29BFE",
  };

  return (Object.entries(totals) as [ActivityCategory, number][]).map(
    ([category, total]) => ({
      category,
      total: Math.round(total * 100) / 100,
      percentage:
        grandTotal > 0 ? Math.round((total / grandTotal) * 1000) / 10 : 0,
      color: colors[category],
    }),
  );
}

/**
 * Get total CO₂ for a date range.
 */
export function getTotalCo2(
  activities: Activity[],
  startDate?: string,
  endDate?: string,
): number {
  let filtered = activities;
  if (startDate) {
    filtered = filtered.filter((a) => a.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter((a) => a.date <= endDate);
  }
  return (
    Math.round(filtered.reduce((sum, a) => sum + a.co2Amount, 0) * 100) / 100
  );
}

/**
 * Calculate daily average CO₂ for a set of activities.
 */
export function getDailyAverage(activities: Activity[]): number {
  if (activities.length === 0) return 0;
  const dates = new Set(activities.map((a) => a.date));
  const total = activities.reduce((sum, a) => sum + a.co2Amount, 0);
  return Math.round((total / dates.size) * 100) / 100;
}

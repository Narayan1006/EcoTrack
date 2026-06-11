// ============================================================================
// EcoTrack — Type Definitions
// ============================================================================

export type ActivityCategory = "transport" | "food" | "energy" | "shopping";

export interface ActivitySubtype {
  id: string;
  label: string;
  category: ActivityCategory;
  icon: string;
  unit: string;
  emissionFactor: number; // kg CO₂ per unit
  defaultValue: number;
}

export interface Activity {
  id: string;
  category: ActivityCategory;
  subtypeId: string;
  value: number;
  unit: string;
  co2Amount: number; // kg CO₂
  date: string; // ISO date
  note?: string;
  createdAt: string;
}

export interface DailyTotal {
  date: string;
  total: number;
  transport: number;
  food: number;
  energy: number;
  shopping: number;
}

export interface CategoryBreakdown {
  category: ActivityCategory;
  total: number;
  percentage: number;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  targetCo2: number; // kg CO₂ monthly limit
  currentCo2: number;
  month: string; // YYYY-MM
  isCompleted: boolean;
  createdAt: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface EcoAction {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  impact: "low" | "medium" | "high";
  difficulty: "easy" | "medium" | "hard";
  co2Savings: number; // kg CO₂ saved per year
  isCompleted: boolean;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AnalyticsData {
  totalCo2: number;
  dailyAverage: number;
  weeklyTrend: DailyTotal[];
  monthlyTrend: DailyTotal[];
  categoryBreakdown: CategoryBreakdown[];
  globalAverage: number;
  nationalAverage: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  totalActivities: number;
  memberSince: string;
  streak: number;
}

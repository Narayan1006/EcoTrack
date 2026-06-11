// ============================================================================
// EcoTrack — Mock Data Service (Demo Mode)
// Provides realistic sample data when Firebase is not configured
// ============================================================================

import { Activity, Goal, Badge, ChatMessage } from '@/types';
import { BADGES } from './constants';
import { v4 as uuid } from 'uuid';

/**
 * Generate dates for the last N days in YYYY-MM-DD format.
 */
function getDateRange(days: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

/**
 * Generate mock activities for the past 30 days.
 */
export function generateMockActivities(): Activity[] {
  const dates = getDateRange(30);
  const activities: Activity[] = [];

  const templates = [
    { subtypeId: 'car-petrol', category: 'transport' as const, value: 15, co2Amount: 3.15, unit: 'km' },
    { subtypeId: 'bus', category: 'transport' as const, value: 20, co2Amount: 1.78, unit: 'km' },
    { subtypeId: 'train', category: 'transport' as const, value: 40, co2Amount: 1.64, unit: 'km' },
    { subtypeId: 'motorcycle', category: 'transport' as const, value: 12, co2Amount: 1.24, unit: 'km' },
    { subtypeId: 'meat-heavy', category: 'food' as const, value: 1, co2Amount: 3.3, unit: 'meal' },
    { subtypeId: 'vegetarian', category: 'food' as const, value: 2, co2Amount: 1.4, unit: 'meal' },
    { subtypeId: 'vegan', category: 'food' as const, value: 1, co2Amount: 0.4, unit: 'meal' },
    { subtypeId: 'coffee', category: 'food' as const, value: 2, co2Amount: 0.42, unit: 'cup' },
    { subtypeId: 'electricity', category: 'energy' as const, value: 8, co2Amount: 6.56, unit: 'kWh' },
    { subtypeId: 'ac-usage', category: 'energy' as const, value: 3, co2Amount: 4.5, unit: 'hours' },
    { subtypeId: 'lpg', category: 'energy' as const, value: 0.3, co2Amount: 0.89, unit: 'kg' },
    { subtypeId: 'online-order', category: 'shopping' as const, value: 1, co2Amount: 3.1, unit: 'package' },
    { subtypeId: 'groceries', category: 'shopping' as const, value: 3, co2Amount: 1.5, unit: 'bag' },
  ];

  for (const date of dates) {
    // 3-6 random activities per day
    const count = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const variance = 0.7 + Math.random() * 0.6; // 70-130% variance
      activities.push({
        id: uuid(),
        category: template.category,
        subtypeId: template.subtypeId,
        value: Math.round(template.value * variance * 10) / 10,
        unit: template.unit,
        co2Amount: Math.round(template.co2Amount * variance * 100) / 100,
        date,
        createdAt: new Date(date).toISOString(),
      });
    }
  }

  return activities;
}

/**
 * Generate mock goals.
 */
export function generateMockGoals(): Goal[] {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

  return [
    {
      id: uuid(),
      title: 'Reduce Monthly Carbon Footprint',
      targetCo2: 200,
      currentCo2: 156.8,
      month: currentMonth,
      isCompleted: false,
      createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    },
    {
      id: uuid(),
      title: 'Green Commute Month',
      targetCo2: 50,
      currentCo2: 32.4,
      month: currentMonth,
      isCompleted: false,
      createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    },
    {
      id: uuid(),
      title: 'Last Month Challenge',
      targetCo2: 250,
      currentCo2: 220.3,
      month: lastMonthStr,
      isCompleted: true,
      createdAt: lastMonth.toISOString(),
    },
  ];
}

/**
 * Generate mock badges with some unlocked.
 */
export function generateMockBadges(): Badge[] {
  return BADGES.map((badge, i) => ({
    ...badge,
    isUnlocked: i < 4, // First 4 unlocked
    unlockedAt: i < 4 ? new Date(Date.now() - (4 - i) * 86400000 * 7).toISOString() : undefined,
  }));
}

/**
 * Mock AI assistant responses.
 */
const MOCK_RESPONSES = [
  "Based on your recent activity patterns, I notice your transport emissions are above average. Consider using public transit or carpooling 2-3 days a week — this alone could reduce your carbon footprint by 30%! 🚌",
  "Great job on logging consistently! Your food emissions are well-managed. To further reduce them, try having one more plant-based meal per day. Even small changes add up to significant CO₂ savings over time. 🥗",
  "I see you've been using AC quite a bit this week. Setting your thermostat 2°C higher and using a ceiling fan can save up to 200 kg CO₂ per year while keeping you comfortable. ❄️➡️🌬️",
  "Your shopping-related emissions spiked recently. Consider buying second-hand items when possible — pre-owned electronics and clothing can reduce your shopping footprint by up to 70%. ♻️",
  "You're doing better than 65% of users in your region! Keep up the momentum. Your biggest opportunity for improvement is in energy usage — switching to LED bulbs and unplugging idle devices are easy wins. 💡",
  "Looking at your weekly trends, Mondays tend to have the highest emissions (likely from commuting). Could you work from home on Mondays? This single change could save ~2 kg CO₂ per week! 🏠",
];

let mockResponseIndex = 0;

export function getMockAssistantResponse(userMessage: string): string {
  // Simple keyword-based response selection
  const msg = userMessage.toLowerCase();
  if (msg.includes('transport') || msg.includes('car') || msg.includes('drive') || msg.includes('commute')) {
    return MOCK_RESPONSES[0];
  }
  if (msg.includes('food') || msg.includes('eat') || msg.includes('diet') || msg.includes('meal')) {
    return MOCK_RESPONSES[1];
  }
  if (msg.includes('energy') || msg.includes('electricity') || msg.includes('ac') || msg.includes('power')) {
    return MOCK_RESPONSES[2];
  }
  if (msg.includes('shop') || msg.includes('buy') || msg.includes('purchase')) {
    return MOCK_RESPONSES[3];
  }
  if (msg.includes('progress') || msg.includes('how am i') || msg.includes('score')) {
    return MOCK_RESPONSES[4];
  }
  // Cycle through responses for generic questions
  const response = MOCK_RESPONSES[mockResponseIndex % MOCK_RESPONSES.length];
  mockResponseIndex++;
  return response;
}

/**
 * Initial welcome message for the AI assistant.
 */
export function getWelcomeMessage(): ChatMessage {
  return {
    id: uuid(),
    role: 'assistant',
    content: "👋 Hi! I'm your EcoTrack AI Assistant, powered by Google Gemini. I can help you understand your carbon footprint, suggest personalized ways to reduce it, and answer questions about sustainable living. What would you like to know?",
    timestamp: new Date().toISOString(),
  };
}

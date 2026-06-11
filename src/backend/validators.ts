// ============================================================================
// EcoTrack — Zod Validation Schemas
// ============================================================================

import { z } from 'zod';

export const ActivityCategorySchema = z.enum(['transport', 'food', 'energy', 'shopping']);

export const CreateActivitySchema = z.object({
  category: ActivityCategorySchema,
  subtypeId: z.string().min(1, 'Subtype is required'),
  value: z.number().positive('Value must be positive').max(100000, 'Value too large'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  note: z.string().max(500, 'Note too long').optional(),
});

export const CreateGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  targetCo2: z.number().positive('Target must be positive').max(10000, 'Target too large'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be YYYY-MM'),
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
});

export type CreateActivityInput = z.infer<typeof CreateActivitySchema>;
export type CreateGoalInput = z.infer<typeof CreateGoalSchema>;
export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;

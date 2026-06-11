import {
  CreateActivitySchema,
  CreateGoalSchema,
  ChatMessageSchema,
} from "@/backend/validators";

describe("Validators (src/backend/validators.ts)", () => {
  describe("CreateActivitySchema", () => {
    it("accepts valid activity input", () => {
      const validData = {
        category: "transport",
        subtypeId: "car-petrol",
        value: 15.5,
        date: "2026-06-11",
        note: "Drive to work",
      };
      const result = CreateActivitySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects invalid category", () => {
      const result = CreateActivitySchema.safeParse({
        category: "invalid_category",
        subtypeId: "car-petrol",
        value: 15.5,
        date: "2026-06-11",
      });
      expect(result.success).toBe(false);
    });

    it("rejects negative value", () => {
      const result = CreateActivitySchema.safeParse({
        category: "transport",
        subtypeId: "car-petrol",
        value: -5,
        date: "2026-06-11",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid date format", () => {
      const result = CreateActivitySchema.safeParse({
        category: "transport",
        subtypeId: "car-petrol",
        value: 10,
        date: "11-06-2026", // wrong format
      });
      expect(result.success).toBe(false);
    });
  });

  describe("CreateGoalSchema", () => {
    it("accepts valid goal input", () => {
      const validData = {
        title: "Reduce driving",
        targetCo2: 100,
        month: "2026-06",
      };
      const result = CreateGoalSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("rejects empty title", () => {
      const result = CreateGoalSchema.safeParse({
        title: "",
        targetCo2: 100,
        month: "2026-06",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid month format", () => {
      const result = CreateGoalSchema.safeParse({
        title: "Goal",
        targetCo2: 100,
        month: "06-2026",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("ChatMessageSchema", () => {
    it("accepts valid message", () => {
      const result = ChatMessageSchema.safeParse({ message: "Hello" });
      expect(result.success).toBe(true);
    });

    it("rejects empty message", () => {
      const result = ChatMessageSchema.safeParse({ message: "" });
      expect(result.success).toBe(false);
    });
  });
});

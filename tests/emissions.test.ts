import {
  calculateEmission,
  getUnitForSubtype,
  groupActivitiesByDate,
  getCategoryBreakdown,
  getTotalCo2,
  getDailyAverage,
} from "@/backend/emissions";
import type { Activity } from "@/types";

describe("Emission Engine (src/backend/emissions.ts)", () => {
  describe("calculateEmission", () => {
    it("calculates correct CO2 for car-petrol", () => {
      // car-petrol factor is 0.21. So 10 * 0.21 = 2.1
      expect(calculateEmission("car-petrol", 10)).toBe(2.1);
    });

    it("calculates correct CO2 for meat-heavy", () => {
      // meat-heavy factor is 3.3. So 2 * 3.3 = 6.6
      expect(calculateEmission("meat-heavy", 2)).toBe(6.6);
    });

    it("throws error for invalid subtype", () => {
      expect(() => calculateEmission("invalid_subtype", 10)).toThrow();
    });
  });

  describe("getUnitForSubtype", () => {
    it("returns km for transport", () => {
      expect(getUnitForSubtype("car-petrol")).toBe("km");
    });

    it("returns meal for food", () => {
      expect(getUnitForSubtype("meat-heavy")).toBe("meal");
    });
  });

  describe("Aggregations", () => {
    const mockActivities: Activity[] = [
      {
        id: "1",
        date: "2026-06-11",
        category: "transport",
        subtypeId: "car-petrol",
        value: 10,
        co2Amount: 2.1,
        createdAt: Date.now(),
      },
      {
        id: "2",
        date: "2026-06-11",
        category: "food",
        subtypeId: "meat-heavy",
        value: 1,
        co2Amount: 3.3,
        createdAt: Date.now(),
      },
      {
        id: "3",
        date: "2026-06-12",
        category: "transport",
        subtypeId: "car-petrol",
        value: 20,
        co2Amount: 4.2,
        createdAt: Date.now(),
      },
    ];

    describe("groupActivitiesByDate", () => {
      it("groups and sums CO2 by date correctly", () => {
        const result = groupActivitiesByDate(mockActivities);
        expect(result).toHaveLength(2);

        const day1 = result.find((r) => r.date === "2026-06-11");
        expect(day1).toBeDefined();
        expect(day1?.total).toBe(5.4); // 2.1 + 3.3
        expect(day1?.transport).toBe(2.1);
        expect(day1?.food).toBe(3.3);

        const day2 = result.find((r) => r.date === "2026-06-12");
        expect(day2).toBeDefined();
        expect(day2?.total).toBe(4.2);
        expect(day2?.transport).toBe(4.2);
        expect(day2?.food).toBe(0);
      });
    });

    describe("getCategoryBreakdown", () => {
      it("calculates total and percentage per category", () => {
        const result = getCategoryBreakdown(mockActivities);
        expect(result).toHaveLength(4); // transport, food, energy, shopping

        const transport = result.find((r) => r.category === "transport");
        expect(transport?.total).toBe(6.3); // 2.1 + 4.2
        // total CO2 = 9.6
        // transport % = 6.3 / 9.6 = 65.625% -> rounded to 65.6%
        expect(transport?.percentage).toBe(65.6);

        const food = result.find((r) => r.category === "food");
        expect(food?.total).toBe(3.3);
      });
    });

    describe("getTotalCo2", () => {
      it("returns total CO2 for all activities", () => {
        expect(getTotalCo2(mockActivities)).toBe(9.6);
      });

      it("filters by date range", () => {
        expect(getTotalCo2(mockActivities, "2026-06-12", "2026-06-12")).toBe(
          4.2,
        );
        expect(getTotalCo2(mockActivities, "2026-06-11", "2026-06-11")).toBe(
          5.4,
        );
      });
    });

    describe("getDailyAverage", () => {
      it("calculates average per active day", () => {
        // Total = 9.6 over 2 days = 4.8
        expect(getDailyAverage(mockActivities)).toBe(4.8);
      });

      it("returns 0 for empty activities", () => {
        expect(getDailyAverage([])).toBe(0);
      });
    });
  });
});

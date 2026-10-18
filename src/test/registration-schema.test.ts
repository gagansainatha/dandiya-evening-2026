import { describe, expect, it } from "vitest";
import { DEPARTMENTS, SEMESTERS, registrationSchema } from "@/lib/registration-schema";

const valid = {
  full_name: "Schema Test", usn: "TEST1234", email: "schema@example.com",
  department: "CS Engineering", semester: "7", attendance: "Definitely attending",
  eligibility_confirmed: true,
};

describe("Registration constraints", () => {
  it("offers only seven semesters and stores their numeric values", () => {
    expect(SEMESTERS).toEqual([1, 2, 3, 4, 5, 6, 7]);
    for (const semester of SEMESTERS) {
      expect(registrationSchema.parse({ ...valid, semester: String(semester) }).semester).toBe(semester);
    }
    for (const semester of [0, 8, 9, 10, 1.5]) {
      expect(registrationSchema.safeParse({ ...valid, semester }).success).toBe(false);
    }
  });

  it("preserves all eight allowed departments", () => {
    const expected = ["CS Engineering", "CSE IN A.I & M.L Engineering", "A.I & M.L Engineering", "EC Engineering", "CSE IN D.S. Engineering", "Mechanical Engineering", "Civil Engineering", "VVIMS"];
    expect(DEPARTMENTS).toEqual(expected);
    for (const department of expected) {
      expect(registrationSchema.parse({ ...valid, department }).department).toBe(department);
    }
    expect(registrationSchema.safeParse({ ...valid, department: "Other" }).success).toBe(false);
  });
});
import { z } from "zod";

export const DEPARTMENTS = [
  "CS Engineering",
  "CSE IN A.I & M.L Engineering",
  "A.I & M.L Engineering",
  "EC Engineering",
  "CSE IN D.S. Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "VVIMS",
] as const;

export const ATTENDANCE = ["Definitely attending", "Very likely", "Maybe", "Not sure yet"] as const;
export const YES_NO_MAYBE = ["Yes", "No", "Maybe"] as const;
export const ACTIVITIES = [
  "Group dance",
  "Solo dance",
  "Singing",
  "Ramp walk",
  "Other performance",
  "Volunteer",
  "Stall",
  "Other",
] as const;
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

const optText = (max: number) =>
  z.string().trim().max(max, `Must be under ${max} characters`).optional().transform((v) => (v ? v : undefined));

export const normaliseUsn = (v: string) => v.replace(/[\s-]/g, "").toUpperCase();

export const registrationSchema = z
  .object({
    full_name: z.string().trim().min(2, "Please enter your full name").max(100, "Name is too long"),
    usn: z
      .string()
      .transform(normaliseUsn)
      .pipe(z.string().regex(/^[A-Z0-9]{4,20}$/, "Enter a valid USN (letters and numbers only)")),
    department: z.enum(DEPARTMENTS, { message: "Please choose your department" }),
    semester: z.coerce.number().int().min(1, "Please choose your semester").max(10),
    email: z.string().trim().toLowerCase().email("Enter a valid email address").max(255),
    phone: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : undefined))
      .refine((v) => !v || /^\+?[0-9 ]{7,15}$/.test(v), "Enter a valid phone number"),
    attendance: z.enum(ATTENDANCE, { message: "Please tell us how likely you are to attend" }),
    dandiya_interest: z.enum(YES_NO_MAYBE).optional(),
    activities: z.array(z.enum(ACTIVITIES)).max(8).default([]),
    other_activity: optText(200),
    stall_interest: z.enum(YES_NO_MAYBE).optional(),
    stall_details: optText(1000),
    suggestions: optText(1000),
    eligibility_confirmed: z.literal(true, { message: "Please confirm you are a VVIT student" }),
  })
  .transform((d) => ({
    ...d,
    activities: Array.from(new Set(d.activities)),
    other_activity: d.activities.includes("Other") ? d.other_activity : undefined,
    stall_details: d.stall_interest === "Yes" || d.stall_interest === "Maybe" ? d.stall_details : undefined,
  }));

export type RegistrationInput = z.input<typeof registrationSchema>;
export type Registration = z.output<typeof registrationSchema>;

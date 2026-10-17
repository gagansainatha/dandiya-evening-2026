import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { registrationSchema } from "./registration-schema";

export type SubmitResult = { ok: true } | { ok: false; error: string };

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = registrationSchema.safeParse(input);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid form");
    return parsed.data;
  })
  .handler(async ({ data }): Promise<SubmitResult> => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return { ok: false, error: "Registration is temporarily unavailable." };

    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    // Insert only — anonymous visitors have no read access, so no .select().
    const { error } = await client.from("registrations").insert({
      full_name: data.full_name,
      usn: data.usn,
      department: data.department,
      semester: data.semester,
      email: data.email,
      phone: data.phone ?? null,
      attendance: data.attendance,
      dandiya_interest: data.dandiya_interest ?? null,
      activities: data.activities,
      other_activity: data.other_activity ?? null,
      stall_interest: data.stall_interest ?? null,
      stall_details: data.stall_details ?? null,
      suggestions: data.suggestions ?? null,
      eligibility_confirmed: true,
    });

    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "This USN has already been registered. Each student can register only once." };
      }
      console.error("registration insert failed", error.code, error.message);
      return { ok: false, error: "We couldn't save your registration. Please check your details and try again." };
    }
    return { ok: true };
  });

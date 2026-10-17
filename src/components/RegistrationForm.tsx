import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2 } from "lucide-react";
import { submitRegistration } from "@/lib/registration.functions";
import {
  ACTIVITIES,
  ATTENDANCE,
  DEPARTMENTS,
  SEMESTERS,
  YES_NO_MAYBE,
  registrationSchema,
} from "@/lib/registration-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type FormState = {
  full_name: string;
  usn: string;
  department: string;
  semester: string;
  email: string;
  phone: string;
  attendance: string;
  dandiya_interest: string;
  activities: string[];
  other_activity: string;
  stall_interest: string;
  stall_details: string;
  suggestions: string;
  eligibility_confirmed: boolean;
};

const initial: FormState = {
  full_name: "",
  usn: "",
  department: "",
  semester: "",
  email: "",
  phone: "",
  attendance: "",
  dandiya_interest: "",
  activities: [],
  other_activity: "",
  stall_interest: "",
  stall_details: "",
  suggestions: "",
  eligibility_confirmed: false,
};

const selectCls =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Req() {
  return <span className="text-saffron" aria-hidden="true"> *</span>;
}

function FieldError({ id, msg }: { id: string; msg?: string | undefined }) {
  if (!msg) return null;
  return <p id={id} className="text-sm text-destructive">{msg}</p>;
}

function Pills({
  name,
  value,
  onChange,
  legend,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  legend: string;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {YES_NO_MAYBE.map((o) => (
          <label
            key={o}
            className="cursor-pointer rounded-full border border-input px-4 py-1.5 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
          >
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function RegistrationForm() {
  const submit = useServerFn(submitRegistration);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const showStall = form.stall_interest === "Yes" || form.stall_interest === "Maybe";
  const showOther = form.activities.includes("Other");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setServerError(null);
    const payload = {
      ...form,
      dandiya_interest: form.dandiya_interest || undefined,
      stall_interest: form.stall_interest || undefined,
      semester: form.semester || "0",
    };
    const parsed = registrationSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0]);
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      const first = Object.keys(errs)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      const res = await submit({ data: payload });
      if (res.ok) {
        setDone(true);
        document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
      } else {
        setServerError(res.error);
      }
    } catch {
      setServerError("Something went wrong while saving. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="festive-card fade-up mx-auto max-w-xl p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto h-14 w-14 text-success" aria-hidden="true" />
        <h3 className="mt-4 text-3xl font-semibold">You're registered!</h3>
        <p className="mt-3 text-muted-foreground">
          Your response has been recorded. Registration for Dandiya Evening 2026 is free — there is nothing to pay.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          If you expressed interest in performing or running a stall, organisers will review it. Participation and
          stall allocation are subject to organiser confirmation.
        </p>
      </div>
    );
  }

  const err = (k: string) => errors[k];
  const aria = (k: string) =>
    err(k) ? { "aria-invalid": true as const, "aria-describedby": `e-${k}` } : {};

  return (
    <form onSubmit={onSubmit} noValidate className="festive-card mx-auto max-w-3xl space-y-8 p-6 sm:p-10">
      <p className="text-sm text-muted-foreground">
        This information helps organisers estimate attendance and coordinate activities. Fields marked
        <span className="text-saffron"> *</span> are required.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="f-full_name">Full name<Req /></Label>
          <Input id="f-full_name" autoComplete="name" maxLength={100} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} {...aria("full_name")} />
          <FieldError id="e-full_name" msg={err("full_name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="f-usn">USN / Student ID<Req /></Label>
          <Input id="f-usn" maxLength={24} className="uppercase" value={form.usn} onChange={(e) => set("usn", e.target.value)} {...aria("usn")} />
          <FieldError id="e-usn" msg={err("usn")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="f-email">College email<Req /></Label>
          <Input id="f-email" type="email" autoComplete="email" maxLength={255} value={form.email} onChange={(e) => set("email", e.target.value)} {...aria("email")} />
          <FieldError id="e-email" msg={err("email")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="f-department">Department<Req /></Label>
          <select id="f-department" className={selectCls} value={form.department} onChange={(e) => set("department", e.target.value)} {...aria("department")}>
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <FieldError id="e-department" msg={err("department")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="f-semester">Current semester<Req /></Label>
          <select id="f-semester" className={selectCls} value={form.semester} onChange={(e) => set("semester", e.target.value)} {...aria("semester")}>
            <option value="">Select semester</option>
            {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <FieldError id="e-semester" msg={err("semester")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="f-phone">Contact number <span className="text-muted-foreground">(optional)</span></Label>
          <Input id="f-phone" type="tel" autoComplete="tel" maxLength={16} value={form.phone} onChange={(e) => set("phone", e.target.value)} {...aria("phone")} />
          <FieldError id="e-phone" msg={err("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="f-attendance">How likely are you to attend?<Req /></Label>
          <select id="f-attendance" className={selectCls} value={form.attendance} onChange={(e) => set("attendance", e.target.value)} {...aria("attendance")}>
            <option value="">Select one</option>
            {ATTENDANCE.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <FieldError id="e-attendance" msg={err("attendance")} />
        </div>
      </div>

      <div className="festive-rule opacity-60" />

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold">Participation & stalls <span className="text-sm font-normal text-muted-foreground">(optional)</span></h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Expressing interest does not guarantee a performance slot or stall — all are subject to organiser confirmation.
          </p>
        </div>

        <Pills name="dandiya" legend="Interested in Dandiya / Garba participation?" value={form.dandiya_interest} onChange={(v) => set("dandiya_interest", v)} />

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Interested in other activities? Select all that apply.</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ACTIVITIES.map((a) => {
              const checked = form.activities.includes(a);
              return (
                <label key={a} className="flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm has-[[data-state=checked]]:border-primary">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(c) =>
                      set("activities", c ? [...form.activities, a] : form.activities.filter((x) => x !== a))
                    }
                  />
                  {a}
                </label>
              );
            })}
          </div>
        </fieldset>

        {showOther && (
          <div className="space-y-2 fade-up">
            <Label htmlFor="f-other_activity">Please specify the other activity</Label>
            <Input id="f-other_activity" maxLength={200} value={form.other_activity} onChange={(e) => set("other_activity", e.target.value)} {...aria("other_activity")} />
            <FieldError id="e-other_activity" msg={err("other_activity")} />
          </div>
        )}

        <Pills name="stall" legend="Interested in running a stall?" value={form.stall_interest} onChange={(v) => set("stall_interest", v)} />

        {showStall && (
          <div className="space-y-2 fade-up">
            <Label htmlFor="f-stall_details">Proposed stall type, products or activity, and any special requirements</Label>
            <Textarea id="f-stall_details" rows={3} maxLength={1000} value={form.stall_details} onChange={(e) => set("stall_details", e.target.value)} {...aria("stall_details")} />
            <FieldError id="e-stall_details" msg={err("stall_details")} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="f-suggestions">Suggestions or requirements</Label>
          <Textarea id="f-suggestions" rows={3} maxLength={1000} value={form.suggestions} onChange={(e) => set("suggestions", e.target.value)} {...aria("suggestions")} />
          <FieldError id="e-suggestions" msg={err("suggestions")} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-3 text-sm">
          <Checkbox
            id="f-eligibility_confirmed"
            checked={form.eligibility_confirmed}
            onCheckedChange={(c) => set("eligibility_confirmed", c === true)}
            className="mt-0.5"
            {...aria("eligibility_confirmed")}
          />
          <span>I confirm I am a current student of Vijaya Vittala Institute Of Technology.<Req /></span>
        </label>
        <FieldError id="e-eligibility_confirmed" msg={err("eligibility_confirmed")} />
      </div>

      {serverError && (
        <p role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full text-base" disabled={saving}>
        {saving ? "Saving your registration…" : "Register Free"}
      </Button>
    </form>
  );
}

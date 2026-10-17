import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { ACTIVITIES, ATTENDANCE, DEPARTMENTS, SEMESTERS, YES_NO_MAYBE } from "@/lib/registration-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Organiser dashboard — Dandiya Evening 2026" },
      { name: "description", content: "Private registration dashboard for organisers." },
      { property: "og:title", content: "Organiser dashboard — Dandiya Evening 2026" },
      { property: "og:description", content: "Private registration dashboard for organisers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Row = Tables<"registrations">;
const PAGE = 25;
const selectCls = "h-9 rounded-md border border-input bg-background px-2 text-sm";

async function fetchAll(): Promise<{ organiser: boolean; rows: Row[] }> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return { organiser: false, rows: [] };
  const { data: roles, error: rErr } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
  if (rErr) throw rErr;
  if (!roles?.some((r) => r.role === "organiser")) return { organiser: false, rows: [] };
  const rows: Row[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, from + 999);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return { organiser: true, rows };
}

function countBy<T extends string>(rows: Row[], keys: readonly T[], get: (r: Row) => string | string[] | null) {
  return keys.map((k) => ({
    k,
    n: rows.filter((r) => {
      const v = get(r);
      return Array.isArray(v) ? v.includes(k) : v === k;
    }).length,
  }));
}

function csvCell(v: unknown) {
  let s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="festive-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}

function Breakdown({ title, items }: { title: string; items: { k: string; n: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.n));
  return (
    <div className="festive-card p-5">
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.k}>
            <div className="flex justify-between gap-2"><span>{i.k}</span><span className="font-semibold">{i.n}</span></div>
            <div className="mt-1 h-1.5 rounded-full bg-muted">
              <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(i.n / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["registrations"], queryFn: fetchAll });
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [sem, setSem] = useState("");
  const [att, setAtt] = useState("");
  const [act, setAct] = useState("");
  const [stall, setStall] = useState("");
  const [page, setPage] = useState(0);

  const rows = q.data?.rows ?? [];
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!s || r.full_name.toLowerCase().includes(s) || r.usn.toLowerCase().includes(s)) &&
        (!dept || r.department === dept) &&
        (!sem || String(r.semester) === sem) &&
        (!att || r.attendance === att) &&
        (!act || r.activities.includes(act)) &&
        (!stall || r.stall_interest === stall),
    );
  }, [rows, search, dept, sem, att, act, stall]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const view = filtered.slice(page * PAGE, page * PAGE + PAGE);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function exportCsv() {
    const cols: (keyof Row)[] = ["created_at", "full_name", "usn", "department", "semester", "email", "phone", "attendance", "dandiya_interest", "activities", "other_activity", "stall_interest", "stall_details", "suggestions"];
    const lines = [cols.join(","), ...filtered.map((r) => cols.map((c) => csvCell(r[c])).join(","))];
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dandiya-2026-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const resetPage = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(0); };

  if (q.isLoading) return <Shell onSignOut={signOut}><p className="text-muted-foreground">Loading registrations…</p></Shell>;
  if (q.isError) return <Shell onSignOut={signOut}><p role="alert" className="text-destructive">Couldn't load registrations. Please refresh and try again.</p></Shell>;
  if (!q.data?.organiser)
    return (
      <Shell onSignOut={signOut}>
        <div className="festive-card p-6">
          <h2 className="text-xl font-semibold">Not authorised</h2>
          <p className="mt-2 text-muted-foreground">Your account is signed in but has not been granted organiser access.</p>
        </div>
      </Shell>
    );

  const attCounts = countBy(rows, ATTENDANCE, (r) => r.attendance) as [{ k: string; n: number }, { k: string; n: number }, { k: string; n: number }, { k: string; n: number }];

  return (
    <Shell onSignOut={signOut}>
      <section className="space-y-3">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Stat label="Total registrations" value={rows.length} />
          {attCounts.map((c) => <Stat key={c.k} label={c.k} value={c.n} />)}
        </div>
        <p className="text-sm text-muted-foreground">
          Estimated attendance (based on student responses, not guaranteed): about{" "}
          <strong className="text-foreground">{attCounts[0].n + attCounts[1].n}</strong> students ({attCounts[0].n} definitely attending + {attCounts[1].n} very likely), with a further {attCounts[2].n} maybe and {attCounts[3].n} not sure yet.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Breakdown title="By department" items={countBy(rows, DEPARTMENTS, (r) => r.department)} />
        <Breakdown title="Activity interest" items={countBy(rows, ACTIVITIES, (r) => r.activities)} />
        <Breakdown title="Dandiya / Garba interest" items={countBy(rows, YES_NO_MAYBE, (r) => r.dandiya_interest)} />
        <Breakdown title="Stall interest" items={countBy(rows, YES_NO_MAYBE, (r) => r.stall_interest)} />
      </section>

      <section className="festive-card space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Input aria-label="Search by name or USN" placeholder="Search name or USN" value={search} onChange={(e) => resetPage(setSearch)(e.target.value)} className="h-9 w-56" />
          <select aria-label="Department" className={selectCls} value={dept} onChange={(e) => resetPage(setDept)(e.target.value)}>
            <option value="">All departments</option>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select aria-label="Semester" className={selectCls} value={sem} onChange={(e) => resetPage(setSem)(e.target.value)}>
            <option value="">All semesters</option>{SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
          </select>
          <select aria-label="Attendance" className={selectCls} value={att} onChange={(e) => resetPage(setAtt)(e.target.value)}>
            <option value="">All attendance</option>{ATTENDANCE.map((a) => <option key={a}>{a}</option>)}
          </select>
          <select aria-label="Activity" className={selectCls} value={act} onChange={(e) => resetPage(setAct)(e.target.value)}>
            <option value="">All activities</option>{ACTIVITIES.map((a) => <option key={a}>{a}</option>)}
          </select>
          <select aria-label="Stall interest" className={selectCls} value={stall} onChange={(e) => resetPage(setStall)(e.target.value)}>
            <option value="">Any stall interest</option>{YES_NO_MAYBE.map((a) => <option key={a}>{a}</option>)}
          </select>
          <Button size="sm" variant="outline" className="ml-auto" onClick={exportCsv} disabled={!filtered.length}>Export CSV ({filtered.length})</Button>
        </div>

        {filtered.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">{rows.length ? "No registrations match these filters." : "No registrations yet."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs uppercase text-muted-foreground">
                <tr>{["Name", "USN", "Department", "Sem", "Email", "Phone", "Attendance", "Dandiya", "Activities", "Stall", "Registered"].map((h) => <th key={h} className="px-2 py-2 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {view.map((r) => (
                  <tr key={r.id} className="border-b align-top last:border-0">
                    <td className="px-2 py-2 font-medium">{r.full_name}</td>
                    <td className="px-2 py-2">{r.usn}</td>
                    <td className="px-2 py-2">{r.department}</td>
                    <td className="px-2 py-2">{r.semester}</td>
                    <td className="px-2 py-2">{r.email}</td>
                    <td className="px-2 py-2">{r.phone ?? "—"}</td>
                    <td className="px-2 py-2">{r.attendance}</td>
                    <td className="px-2 py-2">{r.dandiya_interest ?? "—"}</td>
                    <td className="px-2 py-2">{r.activities.join(", ") || "—"}{r.other_activity ? ` (${r.other_activity})` : ""}</td>
                    <td className="px-2 py-2">{r.stall_interest ?? "—"}{r.stall_details ? <span className="block text-xs text-muted-foreground">{r.stall_details}</span> : null}</td>
                    <td className="whitespace-nowrap px-2 py-2">{new Date(r.created_at).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-end gap-2 text-sm">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
            <span>Page {page + 1} of {pages}</span>
            <Button size="sm" variant="outline" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}
      </section>
    </Shell>
  );
}

function Shell({ children, onSignOut }: { children: React.ReactNode; onSignOut: () => void }) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-semibold">Dandiya Evening 2026 · Organiser dashboard</h1>
          <Button size="sm" variant="outline" onClick={onSignOut}>Sign out</Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">{children}</main>
    </div>
  );
}

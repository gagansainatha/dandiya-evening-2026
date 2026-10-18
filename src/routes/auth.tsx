import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/vvit-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Organiser sign in — Dandiya Evening 2026" },
      { name: "description", content: "Sign in for Dandiya Evening 2026 organisers." },
      { property: "og:title", content: "Organiser sign in — Dandiya Evening 2026" },
      { property: "og:description", content: "Sign in for Dandiya Evening 2026 organisers." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setError("Incorrect email or password.");
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 drape-bg">
      <form onSubmit={onSubmit} className="festive-card w-full max-w-sm space-y-5 p-8" noValidate>
        <div className="flex flex-col items-center gap-3 text-center">
          <img src={logo.url} alt="Vijaya Vittala Institute Of Technology logo" className="h-16 w-16 rounded-full" />
          <h1 className="text-2xl font-semibold">Organiser sign in</h1>
          <p className="text-sm text-muted-foreground">Access is limited to authorised event organisers.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-center text-sm">
          <Link to="/" className="text-muted-foreground underline-offset-4 hover:underline">Back to event page</Link>
        </p>
      </form>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, Ticket, GraduationCap, Music, Mic2, Sparkles, Store, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RegistrationForm } from "@/components/RegistrationForm";
import poster from "@/assets/dandiya-poster.jpg.asset.json";
import logo from "@/assets/vvit-logo.png.asset.json";

const TITLE = "Dandiya Evening 2026 — Register Free | VVIT Bengaluru";
const DESC =
  "Tradition Meets Togetherness. Dandiya Evening 2026 on Saturday, 24 October 2026 at Vijaya Vittala Institute Of Technology, Bengaluru. Free registration for VVIT students.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function scrollToForm() {
  document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
}

const NAV = [
  ["About", "about"],
  ["Participate", "participate"],
  ["Register", "register"],
  ["FAQ", "faq"],
] as const;

function Index() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#top" className="flex items-center gap-3">
            <img src={logo.url} alt="Vijaya Vittala Institute Of Technology logo" className="h-10 w-10 rounded-full" />
            <span className="font-display text-lg font-semibold leading-tight">Dandiya Evening 2026</span>
          </a>
          <nav aria-label="Main" className="hidden gap-6 text-sm md:flex">
            {NAV.map(([label, id]) => (
              <a key={id} href={`#${id}`} className="text-muted-foreground transition-colors hover:text-foreground">{label}</a>
            ))}
          </nav>
          <Button size="sm" onClick={scrollToForm}>Register Free</Button>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden drape-bg">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-20">
            <div className="fade-up space-y-6 text-center md:text-left">
              <p className="text-sm uppercase tracking-[0.3em] text-gold">Vijaya Vittala Institute Of Technology presents</p>
              <h1 className="text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
                <span className="text-gold-gradient">Dandiya Evening</span>
                <br />
                <span className="text-foreground">2026</span>
              </h1>
              <p className="font-display text-2xl italic text-gold">Tradition Meets Togetherness</p>
              <div className="festive-rule mx-auto w-32 md:mx-0" />
              <div className="flex flex-col gap-3 text-base sm:flex-row sm:justify-center sm:gap-8 md:justify-start">
                <span className="flex items-center justify-center gap-2"><CalendarDays className="h-5 w-5 text-saffron" aria-hidden="true" /> Saturday, 24 October 2026</span>
                <span className="flex items-center justify-center gap-2"><MapPin className="h-5 w-5 text-magenta" aria-hidden="true" /> VVIT, Bengaluru</span>
              </div>
              <div className="flex flex-col items-center gap-3 sm:flex-row md:justify-start">
                <Button size="lg" className="px-10 text-base shadow-[var(--shadow-glow)]" onClick={scrollToForm}>Register Free</Button>
                <span className="text-sm text-muted-foreground">For VVIT students · No fee</span>
              </div>
            </div>
            <div className="fade-up mx-auto w-full max-w-sm">
              <img
                src={poster.url}
                alt="Dandiya Evening 2026 poster: a couple dancing with dandiya sticks under lanterns and colourful drapes on campus at dusk"
                className="aspect-[2/3] w-full rounded-2xl border object-cover shadow-[var(--shadow-glow)]"
                width={854}
                height={1281}
              />
            </div>
          </div>
        </section>

        {/* Info */}
        <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">Event details</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CalendarDays, t: "Date", d: "Saturday, 24 October 2026", c: "text-saffron" },
              { icon: MapPin, t: "Venue", d: "Vijaya Vittala Institute Of Technology, Bengaluru", c: "text-magenta" },
              { icon: Ticket, t: "Registration", d: "Free — individual registration", c: "text-gold" },
              { icon: GraduationCap, t: "Eligibility", d: "Students of Vijaya Vittala Institute Of Technology only", c: "text-saffron" },
            ].map(({ icon: Icon, t, d, c }) => (
              <div key={t} className="festive-card p-6">
                <Icon className={`h-7 w-7 ${c}`} aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Participate */}
        <section id="participate" className="scroll-mt-20 border-y bg-secondary/40 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-3xl font-semibold sm:text-4xl">Be part of the celebration</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              Join the circle, take the stage or set up a stall. Tell us what you'd like to do when you register.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { icon: Users, t: "Dandiya & Garba" },
                { icon: Sparkles, t: "Dance" },
                { icon: Mic2, t: "Singing" },
                { icon: Music, t: "Ramp walk" },
                { icon: Store, t: "Stalls" },
              ].map(({ icon: Icon, t }) => (
                <div key={t} className="festive-card flex flex-col items-center gap-3 p-6 text-center transition-transform hover:-translate-y-1">
                  <Icon className="h-8 w-8 text-gold" aria-hidden="true" />
                  <span className="font-medium">{t}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Performance slots and stalls are subject to organiser confirmation.
            </p>
          </div>
        </section>

        {/* Register */}
        <section id="register" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">Register free</h2>
          <p className="mx-auto mb-10 mt-3 max-w-xl text-center text-muted-foreground">
            One registration per student. It takes about two minutes.
          </p>
          <RegistrationForm />
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 pb-20">
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="who">
              <AccordionTrigger>Who can attend?</AccordionTrigger>
              <AccordionContent>Dandiya Evening 2026 is open to students of Vijaya Vittala Institute Of Technology only.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="fee">
              <AccordionTrigger>Is there a registration fee?</AccordionTrigger>
              <AccordionContent>No. Registration is completely free.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="why">
              <AccordionTrigger>Why should I register?</AccordionTrigger>
              <AccordionContent>Registering helps organisers estimate attendance and plan activities, performances and stalls.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="slot">
              <AccordionTrigger>Does registering guarantee a performance slot or stall?</AccordionTrigger>
              <AccordionContent>
                No. Submitting the form records your interest. Performance participation and stall allocation are subject to organiser confirmation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="once">
              <AccordionTrigger>Can I register more than once?</AccordionTrigger>
              <AccordionContent>Each USN can be registered only once.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center text-sm text-muted-foreground">
          <div className="festive-rule w-24" />
          <p className="font-display text-base text-foreground">Dandiya Evening 2026</p>
          <p>Vijaya Vittala Institute Of Technology, Bengaluru</p>
        </div>
      </footer>
    </div>
  );
}

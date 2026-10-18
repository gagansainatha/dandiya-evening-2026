import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CalendarDays, MapPin, Ticket, GraduationCap, Music, Mic2, Sparkles, Store, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RegistrationForm } from "@/components/RegistrationForm";
import festiveBackground from "@/assets/dandiya-evening-background.jpg";
import logo from "@/assets/vvit-logo.png.asset.json";

const TITLE = "Dandiya Evening 2026 — Register | VVIT Bengaluru";
const DESC =
  "Tradition Meets Togetherness. Register for Dandiya Evening 2026 on Saturday, 24 October 2026 at Vijaya Vittala Institute Of Technology, Bengaluru.";

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
  document.getElementById("register")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

const NAV = [
  ["About", "about"],
  ["Participate", "participate"],
  ["Register", "register"],
  ["FAQ", "faq"],
] as const;

function Index() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const sections = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#top" className="flex min-w-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <img src={logo.url} alt="Vijaya Vittala Institute Of Technology logo" className="h-10 w-10 shrink-0 rounded-full" />
            <span className="max-w-64 font-display text-sm font-semibold leading-tight lg:text-base">Vijaya Vittala Institute Of Technology</span>
          </a>
          <nav aria-label="Main" className="hidden gap-6 text-sm md:flex">
            {NAV.map(([label, id]) => (
              <a key={id} href={`#${id}`} className="nav-link text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{label}</a>
            ))}
          </nav>
          <Button size="sm" className="register-button shrink-0" onClick={scrollToForm}>Register</Button>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="cinematic-hero relative isolate overflow-hidden" aria-label="Dandiya Evening 2026">
          <img src={festiveBackground} alt="" aria-hidden="true" width={1920} height={1024} fetchPriority="high" className="hero-background absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="hero-overlay absolute inset-0 -z-10" />
          <div className="mx-auto flex min-h-[560px] max-w-6xl items-center justify-center px-4 py-16 sm:min-h-[620px] sm:py-20">
            <div className="hero-content w-full max-w-4xl space-y-6 text-center">
              <p className="hero-enter text-xs uppercase text-gold sm:text-sm">VIJAYA VITTALA INSTITUTE OF TECHNOLOGY PRESENTS</p>
              <h1 className="hero-enter text-[44px] font-bold leading-[1.1] text-gold-gradient sm:text-6xl lg:text-7xl">Dandiya Evening <span className="block">2026</span></h1>
              <p className="hero-enter font-display text-xl italic text-gold sm:text-2xl">Tradition Meets Togetherness</p>
              <div className="hero-enter festive-rule mx-auto w-32" />
              <div className="flex flex-col gap-3 text-sm sm:flex-row sm:justify-center sm:gap-8 sm:text-base">
                <span className="hero-fact flex items-center justify-center gap-2"><CalendarDays className="h-5 w-5 text-saffron" aria-hidden="true" /> Saturday, 24 October 2026</span>
                <span className="hero-fact flex items-center justify-center gap-2"><MapPin className="h-5 w-5 text-magenta" aria-hidden="true" /> VVIT, Bengaluru</span>
              </div>
              <div className="hero-enter flex justify-center">
                <Button size="lg" className="register-button px-10 text-base shadow-[var(--shadow-glow)]" onClick={scrollToForm}>Register</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Info */}
        <section id="about" data-reveal className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16">
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">Event details</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CalendarDays, t: "Date", d: "Saturday, 24 October 2026", c: "text-saffron" },
              { icon: MapPin, t: "Venue", d: "Vijaya Vittala Institute Of Technology, Bengaluru", c: "text-magenta" },
              { icon: Ticket, t: "Registration", d: "Individual student registration", c: "text-gold" },
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
        <section id="participate" data-reveal className="scroll-mt-24 border-y bg-secondary/40 py-16">
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
                <div key={t} data-reveal className="participation-card festive-card flex flex-col items-center gap-3 p-6 text-center">
                  <Icon className="participation-icon h-8 w-8 text-gold" aria-hidden="true" />
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
        <section id="register" data-reveal className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16">
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">Register</h2>
          <p className="mx-auto mb-10 mt-3 max-w-xl text-center text-muted-foreground">
            One registration per student. It takes about two minutes.
          </p>
          <RegistrationForm />
        </section>

        {/* FAQ */}
        <section id="faq" data-reveal className="mx-auto max-w-3xl scroll-mt-24 px-4 pb-20">
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

      <footer data-reveal className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center text-sm text-muted-foreground">
          <div className="festive-rule w-24" />
          <p className="font-display text-base text-foreground">Dandiya Evening 2026</p>
          <p>Vijaya Vittala Institute Of Technology, Bengaluru</p>
        </div>
      </footer>
    </div>
  );
}

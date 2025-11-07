'use client';

import React, { useMemo, useState } from "react";

// ---------------- TypeScript types to satisfy strict settings ----------------
export type BillingCycle = "Monthly" | "Annual";

interface Brand { name: string; tagline: string; sub: string }
interface Contact { email: string; calendly: string }
interface SocialLinks { instagram?: string; x?: string }
interface PricingConfig { billingCycles: BillingCycle[]; annualDiscountPct: number }

export interface Tier {
    name: string;
    monthly: number;
    highlight: boolean;
    blurb: string;
    features: string[];
    ctaLabel: string;
    ctaHref: string;
    priceSuffix?: string; // e.g., "+ room/board"
}

export type ComputedTier = Tier & { displayPrice: string; sub: string };


/**
 * Fitness Coaching Landing Page — Starter
 * ------------------------------------------------------
 * How to customize (quick wins):
 * 1) Edit BRAND, CONTACT, SOCIAL, and TIERS below.
 * 2) Swap the hero image URL if you have a brand shot.
 * 3) Publish anywhere (Vercel/Netlify/GH Pages). Tailwind classes are used.
 *
 * Later add-ons (easy to wire up):
 * - Stripe Checkout or Lemon Squeezy (replace CTA on each tier).
 * - Blog (/posts) with MDX or Notion CMS.
 * - Calendly link for free consults.
 * - Analytics (Plausible/GA4) + CRM/email capture.
 */

// ---------- SITE CONFIG ----------

    // ---------- MEDIA CONFIG ----------
const MEDIA = {
        hero: {
            src: "/Physique_march24.jpg",
            alt: "My physique circa March 2024",
        },
    } as const;

const BRAND: Brand = {
    name: "Michael Druggan Coaching",
    tagline: "Bigger. Stronger. Leaner.",
    sub: "Evidence-based training, nutrition, and pharmacology delivered by an experienced practioner.",
};

const CONTACT: Contact = {
    email: "michaeldruggan@gmail.com", // TODO: set your email
    calendly: "https://calendly.com/your-handle/intro-call", // or "#contact" to use the on-page form
};

const SOCIAL: SocialLinks = {
    instagram: "https://instagram.com/swole_druggan",
    x: "https://x.com/Michael_Druggan",
};

// Pricing model supports monthly/annual with auto-discount display
const PRICING: PricingConfig = {
    billingCycles: ["Monthly", "Annual"],
    annualDiscountPct: 0, // display only (you can enforce discount in Stripe later)
};

const TIERS: Tier[] = [
    {
        name: "1 on 1 Coaching",
        monthly: 499,
        highlight: false,
        blurb: "The flagship plan for individualized attention",
        features: [
            "Individualized training program to fit your schedule and goals",
            "Macro targets & meal planning with weekly adjustments",
            "1× videocall check-in per week",
            "24/7 text line for advice",
            "Form checks on any of your lifts"
        ],
        ctaLabel: "Book consult",
        ctaHref: CONTACT.calendly,
    },
    {
        name: "Advanced Coaching",
        monthly: 699,
        highlight: true,
        blurb: "For athletes interested in exploiting pharmacology to push their limits",
        features: [
            "Everything from the 1:1 plan PLUS...",
            "Advice on peptides/hormones/supplements",
            "Bloodwork reviews",
            "Training and diet programs tailored to synergize with your protocol"
        ],
        ctaLabel: "Apply now",
        ctaHref: CONTACT.calendly,
    },
    {
        name: "Executive Plan (In person; only 1 spot available)",
        monthly: 4999,
        priceSuffix: " + room/board",
        highlight: false,
        blurb: "For someone looking for the hands-on Hollywood experience",
        features: [
            "I will move to your location (arrangements negotiable)",
            "Daily personal training sessions with weights + cardio",
            "Meal prepped meals to fit your macros"

        ],
        ctaLabel: "Apply now",
        ctaHref: CONTACT.calendly,
    },
];

// ---------- UI HELPERS ----------
const Check: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path d="M20.285 6.708a1 1 0 0 1 .007 1.414l-9.193 9.28a1 1 0 0 1-1.433 0l-5.96-6.018a1 1 0 1 1 1.44-1.387l5.245 5.294 8.478-8.557a1 1 0 0 1 1.416-.026z"/>
    </svg>
);

function classNames(...xs: Array<string | false | null | undefined>): string {
    return xs.filter(Boolean).join(" ");
}

function currency(n: number): string {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function FitnessCoachLanding() {
    const [billing, setBilling] = useState<BillingCycle>(PRICING.billingCycles[0]);

    const computedTiers: ComputedTier[] = useMemo(() => {
        const annual = billing === "Annual";
        return TIERS.map((t) => {
            const monthly = t.monthly;
            const baseYear = monthly * 12;
            const discountedYear = Math.round(baseYear * (1 - PRICING.annualDiscountPct / 100));

            const baseLabel = annual
                ? `${currency(discountedYear)}/yr`
                : `${currency(monthly)}/mo`;

            const displayPrice = t.priceSuffix ? `${baseLabel} ${t.priceSuffix}` : baseLabel;
            const sub = annual ? `${PRICING.annualDiscountPct}% off annual` : "Billed monthly";

            return { ...t, displayPrice, sub };
        });
    }, [billing]);


    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100">
            <Header />
            <main>
                <Hero billing={billing} setBilling={setBilling} />
                <PricingGrid tiers={computedTiers} billing={billing} setBilling={setBilling} />
                <FAQ />
                <Contact />
            </main>
            <SiteFooter />
        </div>
    );
}

function Header() {
    return (
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-neutral-800">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <a href="#top" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400"/>
                    <span className="font-semibold tracking-tight">{BRAND.name}</span>
                </a>
                <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
                    <a href="#pricing" className="hover:text-white">Pricing</a>
                    <a href="#faq" className="hover:text-white">FAQ</a>
                    <a href="#contact" className="hover:text-white">Contact</a>
                    <a href={CONTACT.calendly} className="ml-2 inline-flex items-center rounded-xl px-4 py-2 bg-emerald-500/90 hover:bg-emerald-500 text-neutral-950 font-semibold">Free consult</a>
                </nav>
            </div>
        </header>
    );
}

function Hero({ billing, setBilling }: { billing: BillingCycle; setBilling: React.Dispatch<React.SetStateAction<BillingCycle>> }) {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[32rem] w-[32rem] rounded-full bg-emerald-500/10 blur-3xl"/>
                <div className="absolute -bottom-24 left-20 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl"/>
            </div>
            <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                        {BRAND.tagline}
                    </h1>
                    <p className="mt-4 text-neutral-300 max-w-prose">
                        {BRAND.sub}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <a href="#pricing" className="inline-flex items-center rounded-xl px-5 py-3 bg-emerald-500 text-neutral-950 font-semibold hover:bg-emerald-400 transition">
                            See pricing
                        </a>
                        <a href={CONTACT.calendly} className="inline-flex items-center rounded-xl px-5 py-3 border border-neutral-700 hover:border-neutral-600">
                            Book a free consult
                        </a>
                    </div>
                    <div className="mt-6 text-xs text-neutral-400">
                        Tip: Toggle billing to preview annual pricing.
                    </div>
                </div>
                <div className="relative">
                    <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden ring-1 ring-neutral-800 bg-neutral-900">
                        {/* Replace with your hero image */}
                        <img
                            src="/Physique_march24.jpg"
                            alt="My physique circa Mar 2024"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-4 left-4 backdrop-blur rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-2 text-sm">
                        Trusted by lifters, athletes, and busy professionals.
                    </div>
                </div>
            </div>
        </section>
    );
}

function PricingGrid({ tiers, billing, setBilling }: { tiers: ComputedTier[]; billing: BillingCycle; setBilling: React.Dispatch<React.SetStateAction<BillingCycle>> }) {
    return (
        <section id="pricing" className="mx-auto max-w-6xl px-4 py-12 md:py-20">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Simple, transparent pricing</h2>
                    <p className="mt-2 text-neutral-400">No contracts. Cancel anytime.</p>
                </div>
                <BillingToggle billing={billing} setBilling={setBilling} />
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-6">
                {tiers.map((t) => (
                    <article key={t.name} className={classNames(
                        "rounded-2xl border p-6 md:p-8 flex flex-col bg-neutral-900/40 ring-1 ring-neutral-800",
                        t.highlight && "border-emerald-400/30 ring-emerald-400/20 shadow-[0_0_40px_-12px_rgba(16,185,129,0.35)]"
                    )}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">{t.name}</h3>
                            {t.highlight && (
                                <span className="text-xs px-2 py-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-300">
                  Most popular
                </span>
                            )}
                        </div>
                        <p className="mt-2 text-neutral-300">{t.blurb}</p>
                        <div className="mt-6">
                            <div className="text-3xl font-extrabold tracking-tight">{t.displayPrice}</div>
                            <div className="text-xs text-neutral-400 mt-1">{t.sub}</div>
                        </div>
                        <ul className="mt-6 space-y-3 text-sm">
                            {t.features.map((f) => (
                                <li key={f} className="flex items-start gap-3">
                                    <Check className="h-5 w-5 mt-0.5 fill-emerald-400" />
                                    <span className="text-neutral-200">{f}</span>
                                </li>
                            ))}
                        </ul>
                        <a
                            href={t.ctaHref}
                            className={classNames(
                                "mt-8 inline-flex justify-center items-center rounded-xl px-4 py-2 font-semibold",
                                t.highlight
                                    ? "bg-emerald-500 text-neutral-950 hover:bg-emerald-400"
                                    : "border border-neutral-700 hover:border-neutral-600"
                            )}
                        >
                            {t.ctaLabel}
                        </a>
                        <p className="mt-3 text-xs text-neutral-400">
                            Checkout coming soon — we’ll integrate Stripe or invoices here.
                        </p>
                    </article>
                ))}
            </div>

            <div className="mt-8 text-xs text-neutral-500">
                Prices shown are estimates; actual billing handled via invoice or Stripe when enabled.
            </div>
        </section>
    );
}

function BillingToggle({
                           billing,
                           setBilling,
                       }: {
    billing: BillingCycle;
    setBilling: React.Dispatch<React.SetStateAction<BillingCycle>>;
}) {
    return (
        <div className="inline-flex items-center rounded-xl border border-neutral-700 overflow-hidden">
            {PRICING.billingCycles.map((opt) => (
                <button
                    key={opt}
                    onClick={() => setBilling(opt)}   // <-- opt is BillingCycle here
                    className={classNames(
                        "px-3 py-1.5 text-sm",
                        billing === opt ? "bg-neutral-800" : "hover:bg-neutral-900"
                    )}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
}



function FAQ() {
    const faqs: Array<{ q: string; a: string }> = [
        {
            q: "Do I need a gym membership?",
            a: "For the most part, yes. Programming will assume access to standard gym equipment such as barbells, dumbbells and basic machines. If your gym has some rarer machines you're interested in (such as a pendulum squat) let me know and I will see if they fit into your program",
        },
        {
            q: "Is there a contract?",
            a: "For standard and advanced coachings there is no long-term contracts. Cancel anytime. The Executive plan will involve a contract as it involves me moving locations",
        },
        {
            q: "How do check-ins work?",
            a: "I'll be available through text 24/7 when I'm not asleep for quick questions and we'll have a video chat weekly for longer explorations",
        },
        {
            q: "Nutrition included?",
            a: "Yes. Macros, and meal plans are included for all clients. I can make the plan more or less flexible depending on client preference",
        },
    ];

    return (
        <section id="faq" className="mx-auto max-w-6xl px-4 py-12 md:py-20">
            <h2 className="text-2xl md:text-3xl font-bold">FAQ</h2>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
                {faqs.map((f) => (
                    <div key={f.q} className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900/40">
                        <h3 className="font-semibold">{f.q}</h3>
                        <p className="mt-2 text-neutral-300">{f.a}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Contact() {
    return (
        <section id="contact" className="mx-auto max-w-3xl px-4 py-16">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold">Let’s talk about your goals</h2>
                <p className="mt-2 text-neutral-300">
                    Prefer email? <a className="text-emerald-400 hover:underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </p>
                <form className="mt-6 grid gap-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-4">
                        <label className="grid gap-1 text-sm">
                            <span className="text-neutral-300">Name</span>
                            <input className="rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600" placeholder="Your name" />
                        </label>
                        <label className="grid gap-1 text-sm">
                            <span className="text-neutral-300">Email</span>
                            <input type="email" className="rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600" placeholder="you@example.com" />
                        </label>
                    </div>
                    <label className="grid gap-1 text-sm">
                        <span className="text-neutral-300">What are you aiming for?</span>
                        <textarea className="rounded-xl bg-neutral-950 border border-neutral-800 px-3 py-2 h-28 resize-y outline-none focus:border-neutral-600" placeholder="e.g., Lose 20 lb, add 100 lb to my total, first show in 2026…" />
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                        <a href={CONTACT.calendly} className="inline-flex items-center rounded-xl px-5 py-3 bg-emerald-500 text-neutral-950 font-semibold hover:bg-emerald-400 transition">
                            Book free consult
                        </a>
                        <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center rounded-xl px-5 py-3 border border-neutral-700 hover:border-neutral-600">
                            Email me instead
                        </a>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                        Submitting doesn’t start billing. Payments will be handled securely via Stripe once enabled.
                    </p>
                </form>
            </div>
        </section>
    );
}

function SiteFooter() {
    return (
        <footer className="border-t border-neutral-800">
            <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400"/>
                    <span>{BRAND.name}</span>
                </div>
                <div className="flex items-center gap-4">
                    <a href="#pricing" className="hover:text-white">Pricing</a>
                    <a href="#faq" className="hover:text-white">FAQ</a>
                    <a href="#contact" className="hover:text-white">Contact</a>
                </div>
                <div className="flex items-center gap-4">
                    <a href={SOCIAL.instagram} className="hover:text-white">Instagram</a>
                    <a href={SOCIAL.x} className="hover:text-white">X</a>
                </div>
            </div>
        </footer>
    );
}

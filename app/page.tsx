"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Command,
  DatabaseZap,
  FileUp,
  Globe2,
  Menu,
  Moon,
  Play,
  Search,
  Send,
  Shield,
  Sparkles,
  Sun,
  UploadCloud,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HeroScene } from "@/components/hero-scene";
import { PwaRegister } from "@/components/pwa-register";
import { analytics, processingJobs } from "@/lib/processing";
import { featuredTools, quickActions, toolCategories } from "@/lib/tools";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">{title}</h2>
      <p className="mt-5 text-base leading-7 text-white/66">{copy}</p>
    </motion.div>
  );
}

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        id: index,
        left: `${(index * 29) % 100}%`,
        top: `${(index * 47) % 100}%`,
        delay: (index % 9) * 0.28,
        size: 2 + (index % 4)
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-cyan/70 shadow-[0_0_18px_rgba(54,244,255,.9)]"
          style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
          animate={{ y: [-16, 22, -16], opacity: [0.15, 0.9, 0.15], scale: [1, 1.8, 1] }}
          transition={{ duration: 6 + (particle.id % 5), repeat: Infinity, delay: particle.delay }}
        />
      ))}
    </div>
  );
}

function Navbar({ theme, setTheme }: { theme: "dark" | "light"; setTheme: (theme: "dark" | "light") => void }) {
  const [open, setOpen] = useState(false);
  const links = ["Tools", "Workspace", "Security", "Pricing"];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3">
        <a href="#" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 shadow-neon">
            <Sparkles className="h-5 w-5 text-cyan" />
          </span>
          <span>
            <span className="block text-sm font-black text-white">FileVerse AI</span>
            <span className="block text-[11px] uppercase tracking-[0.24em] text-white/45">Neon Converter</span>
          </span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-white/68 transition hover:text-cyan">
              {link}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle color theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/8 text-white transition hover:border-cyan/50"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href="#workspace"
            className="focus-ring hidden items-center gap-2 rounded-xl bg-cyan px-4 py-2 text-sm font-black text-ink shadow-neon transition hover:scale-[1.03] sm:flex"
          >
            Launch <ArrowRight className="h-4 w-4" />
          </a>
          <button
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/8 text-white md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/80 p-4 backdrop-blur-xl md:hidden"
          >
            <div className="glass rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <span className="font-black text-white">FileVerse AI</span>
                <button aria-label="Close navigation" onClick={() => setOpen(false)} className="text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-8 grid gap-3">
                {links.map((link) => (
                  <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setOpen(false)} className="rounded-2xl bg-white/8 px-4 py-4 text-white">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[940px] overflow-hidden px-4 pt-32 sm:min-h-[900px] lg:min-h-[820px]">
      <div className="cyber-grid absolute inset-0" />
      <HeroScene />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.7 }} className="max-w-3xl">
          <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/75">
            <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_18px_#b8ff65]" />
            AI universal file operating system
          </div>
          <h1 className="mt-7 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
            FileVerse AI
          </h1>
          <p className="neon-text mt-4 text-2xl font-black sm:text-4xl">Neon Converter for every file.</p>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            Convert, compress, unlock, protect, summarize, enhance, translate, repair, and automate PDFs, images,
            videos, audio, and office documents inside one encrypted AI workspace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#workspace" className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan px-6 py-4 font-black text-ink shadow-neon transition hover:scale-[1.02]">
              Start processing <UploadCloud className="h-5 w-5" />
            </a>
            <a href="#tools" className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-white/16 bg-white/8 px-6 py-4 font-bold text-white backdrop-blur transition hover:border-magenta/60">
              Explore tools <Play className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="glass relative rounded-[32px] p-4 sm:p-6 lg:ml-auto lg:max-w-xl">
          <div className="absolute -inset-px rounded-[32px] bg-gradient-to-r from-cyan/40 via-magenta/25 to-lime/30 blur-xl" />
          <div className="relative rounded-[24px] border border-white/12 bg-ink/76 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan">Live Workspace</p>
                <h3 className="mt-2 text-2xl font-black text-white">Processing Nexus</h3>
              </div>
              <Bell className="h-5 w-5 text-lime" />
            </div>
            <div className="mt-5 grid gap-3">
              {processingJobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">{job.fileName}</p>
                      <p className="mt-1 text-xs text-white/48">{job.tool} · {job.status}</p>
                    </div>
                    <span className="text-sm font-black text-cyan">{job.progress}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan via-magenta to-lime" initial={{ width: 0 }} animate={{ width: `${job.progress}%` }} transition={{ duration: 1.2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Tools() {
  return (
    <section id="tools" className="relative z-10 px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Universal toolkit" title="Every high-value file workflow in one neon command center" copy="The platform groups professional PDF tools, image AI, media conversion, office document pipelines, and smart automation into fast reusable modules." />
        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {toolCategories.map((category, index) => (
            <motion.div key={category.name} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="glass rounded-3xl p-5">
              <h3 className="text-xl font-black text-white">{category.name}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {category.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-white/72">
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.article key={tool.name} whileHover={{ y: -8, scale: 1.01 }} className="glass rounded-3xl p-6 transition">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${tool.accent}`}>
                  <Icon className="h-6 w-6 text-ink" />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-white/42">{tool.category}</p>
                <h3 className="mt-2 text-xl font-black text-white">{tool.name}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{tool.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Workspace() {
  return (
    <section id="workspace" className="relative z-10 px-4 py-24">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="glass rounded-[32px] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan">Dropzone</p>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-5xl">Drag files into the AI processing room</h2>
          <div className="mt-8 rounded-[28px] border border-dashed border-cyan/42 bg-cyan/5 p-8 text-center">
            <FileUp className="mx-auto h-12 w-12 text-cyan" />
            <p className="mt-4 text-lg font-black text-white">Auto-detect PDF, DOCX, XLSX, PPTX, JPG, PNG, WEBP, MP4, MP3, ZIP</p>
            <p className="mt-3 text-sm leading-6 text-white/58">Secure upload hooks are ready for encrypted temporary storage, rate-limited APIs, realtime progress, and auto-delete jobs.</p>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {quickActions.slice(0, 10).map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.label} className="focus-ring rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-center text-xs font-bold text-white/70 transition hover:border-cyan/60 hover:text-cyan">
                  <Icon className="mx-auto mb-2 h-5 w-5" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {analytics.map((item) => (
              <div key={item.label} className="glass rounded-3xl p-5">
                <p className="text-sm text-white/52">{item.label}</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-3xl font-black text-white">{item.value}</span>
                  <span className="rounded-full bg-lime/12 px-3 py-1 text-xs font-black text-lime">{item.change}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="glass rounded-[32px] p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-black text-white">Smart recommendations</h3>
              <Search className="h-5 w-5 text-cyan" />
            </div>
            {["Compress large PDF before sharing", "Run OCR on scanned assignment", "Create subtitles from meeting video", "Protect tax folder shared link"].map((item) => (
              <div key={item} className="mt-3 flex items-center justify-between rounded-2xl bg-white/[0.06] p-4 text-sm text-white/72">
                {item}
                <ChevronRight className="h-4 w-4 text-cyan" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SecurityAndTerminal() {
  return (
    <section id="security" className="relative z-10 px-4 py-24">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <div className="glass rounded-[32px] p-6">
          <Shield className="h-10 w-10 text-lime" />
          <h2 className="mt-5 text-3xl font-black text-white">Production security architecture</h2>
          <div className="mt-6 grid gap-3">
            {["JWT authentication and protected APIs", "Rate limiting for uploads and AI endpoints", "Encrypted processing rooms with expiring URLs", "Auto-delete temporary files after completion", "WebSocket progress events and audit logs", "Firebase or Supabase-ready storage adapters"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-4 text-sm text-white/72">
                <Check className="h-4 w-4 text-lime" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="glass overflow-hidden rounded-[32px]">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.06] px-5 py-4">
            <span className="h-3 w-3 rounded-full bg-magenta" />
            <span className="h-3 w-3 rounded-full bg-lime" />
            <span className="h-3 w-3 rounded-full bg-cyan" />
            <span className="ml-auto text-xs uppercase tracking-[0.25em] text-white/45">cyber terminal</span>
          </div>
          <div className="min-h-[360px] p-6 font-mono text-sm leading-7 text-lime">
            <p>$ fileverse scan ./workspace</p>
            <p className="text-cyan">Detected 148 files · 19 workflows · 7 security policies</p>
            <p>$ ai.route --batch --optimize --encrypt</p>
            <p className="text-white/68">PDF-lib queue ready · Sharp queue ready · FFmpeg queue ready · OCR queue ready</p>
            <p>$ websocket progress --threads 8</p>
            <p className="relative overflow-hidden rounded-xl bg-white/[0.06] px-4 py-3 text-white/76">
              <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-cyan/20 to-transparent animate-scan" />
              realtime events streaming to dashboard...
            </p>
            <p className="text-magenta">$ openai tools.attach --summarize --translate --chat-pdf</p>
            <p className="text-white/68">AI assistant online. Ask your files anything.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Starter", price: "$0", features: ["50 monthly conversions", "Basic PDF and image tools", "Offline PWA mode"] },
    { name: "Pro", price: "$19", features: ["Unlimited toolkit access", "AI PDF chat and OCR", "Batch processing", "10 GB encrypted cloud"] },
    { name: "Enterprise", price: "Custom", features: ["Dedicated processing workers", "SSO and audit logs", "Private AI routing", "Admin analytics"] }
  ];

  return (
    <section id="pricing" className="relative z-10 px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Pricing" title="Built for students, creators, teams, and enterprises" copy="Launch as Neon Converter for SEO, then expand into the wider FileVerse AI workspace as users need deeper automation." />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div key={tier.name} whileHover={{ y: -8 }} className={`glass rounded-[32px] p-6 ${index === 1 ? "border-cyan/55 shadow-neon" : ""}`}>
              <h3 className="text-2xl font-black text-white">{tier.name}</h3>
              <p className="mt-4 text-4xl font-black text-white">{tier.price}</p>
              <div className="mt-6 grid gap-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-white/68">
                    <Check className="h-4 w-4 text-cyan" />
                    {feature}
                  </div>
                ))}
              </div>
              <button className="focus-ring mt-8 w-full rounded-2xl bg-white px-5 py-3 font-black text-ink transition hover:bg-cyan">Choose plan</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AssistantWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }} className="glass mb-3 w-[calc(100vw-2.5rem)] max-w-sm rounded-3xl p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan text-ink">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black text-white">FileVerse Assistant</p>
                <p className="text-xs text-white/50">Voice, PDF chat, workflow help</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-white/[0.06] p-4 text-sm leading-6 text-white/68">
              Upload a file and I can summarize, convert, repair, translate, clean, compress, or build a workflow around it.
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2">
              <input className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" placeholder="Ask your files..." />
              <Send className="h-4 w-4 text-cyan" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen((value) => !value)} className="focus-ring grid h-14 w-14 place-items-center rounded-2xl bg-cyan text-ink shadow-neon transition hover:scale-105" aria-label="Open AI assistant">
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </button>
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("workspace")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [reducedMotion]);

  return (
    <>
      <PwaRegister />
      <ParticleField />
      <Navbar theme={theme} setTheme={setTheme} />
      <main className="relative z-10">
        <Hero />
        <Tools />
        <Workspace />
        <SecurityAndTerminal />
        <section className="relative z-10 px-4 py-20">
          <div className="glass mx-auto grid max-w-7xl gap-5 rounded-[32px] p-6 md:grid-cols-3">
            {["Loved by creators converting launch assets in minutes.", "A premium AI workspace for documents, media, and secure teams.", "The best SEO path: rank as Neon Converter, retain with FileVerse AI."].map((quote) => (
              <div key={quote} className="rounded-3xl bg-white/[0.06] p-5 text-sm leading-7 text-white/68">
                <p>{quote}</p>
                <p className="mt-4 font-black text-white">Beta customer</p>
              </div>
            ))}
          </div>
        </section>
        <Pricing />
        <footer className="relative z-10 px-4 pb-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 py-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <span>FileVerse AI · Neon Converter · Universal AI file toolkit</span>
            <span className="inline-flex items-center gap-2"><Command className="h-4 w-4" /> Ctrl/⌘ K opens workspace · <Globe2 className="h-4 w-4" /> multilingual-ready · <DatabaseZap className="h-4 w-4" /> cloud-ready</span>
          </div>
        </footer>
      </main>
      <AssistantWidget />
    </>
  );
}

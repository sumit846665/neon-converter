"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Command,
  FileImage,
  FileText,
  Globe2,
  Image as ImageIcon,
  Menu,
  Moon,
  ScanText,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FreeFileToolkit } from "@/components/free-file-toolkit";
import { HeroScene } from "@/components/hero-scene";
import { PwaRegister } from "@/components/pwa-register";

const features = [
  "Free PDF merge, split, rotate, and PDF to PNG",
  "Free JPG, PNG, and WEBP converter",
  "Image compressor and resize tools",
  "CamScanner-style scan cleanup",
  "OCR text extraction from images",
  "No account required for core tools",
  "Browser-based private processing",
  "Mobile-friendly fast workflow"
];

const seoTools = [
  { title: "Merge PDF Online", copy: "Combine PDF files into one document for free.", icon: FileText },
  { title: "Split PDF Pages", copy: "Download every PDF page as a separate file in a ZIP.", icon: FileText },
  { title: "JPG to PDF", copy: "Convert photos, scans, and screenshots into PDF.", icon: FileImage },
  { title: "PDF to PNG", copy: "Export PDF pages as high-quality PNG images.", icon: ImageIcon },
  { title: "Compress Image", copy: "Reduce image size for upload, forms, and sharing.", icon: Zap },
  { title: "OCR Scanner", copy: "Extract text from scanned images and screenshots.", icon: ScanText }
];

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => ({
        id: index,
        left: `${(index * 31) % 100}%`,
        top: `${(index * 43) % 100}%`,
        delay: (index % 8) * 0.3,
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
          animate={{ y: [-16, 22, -16], opacity: [0.12, 0.85, 0.12], scale: [1, 1.7, 1] }}
          transition={{ duration: 6 + (particle.id % 5), repeat: Infinity, delay: particle.delay }}
        />
      ))}
    </div>
  );
}

function Navbar({ theme, setTheme }: { theme: "dark" | "light"; setTheme: (theme: "dark" | "light") => void }) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#tools", label: "Tools" },
    { href: "#privacy", label: "Privacy" },
    { href: "#seo", label: "All Tools" },
    { href: "#faq", label: "FAQ" }
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3">
        <a href="#" className="flex items-center gap-3" aria-label="Neon Converter home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 shadow-neon">
            <Sparkles className="h-5 w-5 text-cyan" />
          </span>
          <span>
            <span className="block text-sm font-black text-white">Neon Converter</span>
            <span className="block text-[11px] uppercase tracking-[0.24em] text-white/45">Free File Tools</span>
          </span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-white/68 transition hover:text-cyan">
              {link.label}
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
          <a href="#tools" className="focus-ring hidden items-center gap-2 rounded-xl bg-cyan px-4 py-2 text-sm font-black text-ink shadow-neon transition hover:scale-[1.03] sm:flex">
            Convert now <ArrowRight className="h-4 w-4" />
          </a>
          <button onClick={() => setOpen((value) => !value)} className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/8 text-white md:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>
      {open && (
        <div className="glass mx-auto mt-3 grid max-w-7xl gap-2 rounded-2xl p-3 md:hidden">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl bg-white/[0.06] px-4 py-3 text-sm font-bold text-white">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[860px] overflow-hidden px-4 pt-32 sm:min-h-[820px] lg:min-h-[760px]">
      <div className="cyber-grid absolute inset-0" />
      <HeroScene />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="max-w-3xl">
          <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/75">
            <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_18px_#b8ff65]" />
            100% free browser file converter
          </div>
          <h1 className="mt-7 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Neon Converter
          </h1>
          <p className="neon-text mt-4 text-2xl font-black sm:text-4xl">Free PDF, image, OCR and scanner tools.</p>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            A real working iLovePDF and CamScanner style web app for users who need fast free file conversion:
            merge PDF, split PDF, JPG to PDF, PDF to PNG, compress image, resize image, convert WEBP, clean scans, and extract text.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#tools" className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan px-6 py-4 font-black text-ink shadow-neon transition hover:scale-[1.02]">
              Use free tools <ArrowRight className="h-5 w-5" />
            </a>
            <a href="#privacy" className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-white/16 bg-white/8 px-6 py-4 font-bold text-white backdrop-blur transition hover:border-magenta/60">
              Why it is private <ShieldCheck className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="glass relative rounded-[32px] p-5 lg:ml-auto lg:max-w-xl">
          <div className="absolute -inset-px rounded-[32px] bg-gradient-to-r from-cyan/40 via-magenta/25 to-lime/30 blur-xl" />
          <div className="relative rounded-[24px] border border-white/12 bg-ink/76 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan">Popular free tools</p>
            <div className="mt-5 grid gap-3">
              {features.slice(0, 6).map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm font-bold text-white/74">
                  <Check className="h-4 w-4 text-lime" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
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
        document.getElementById("tools")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
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
        <FreeFileToolkit />

        <section id="privacy" className="relative z-10 px-4 py-20">
          <div className="glass mx-auto grid max-w-7xl gap-6 rounded-[32px] p-6 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan">Privacy first</p>
              <h2 className="mt-4 text-3xl font-black text-white sm:text-5xl">Fast tools that run inside the browser</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-4 text-sm text-white/70">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-lime" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="seo" className="relative z-10 px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan">All free online tools</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">A free alternative for PDF conversion, image conversion, scan cleanup and OCR</h2>
              <p className="mt-5 text-base leading-7 text-white/68">
                Neon Converter helps students, office users, creators, and mobile users finish daily file work without installing heavy apps.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {seoTools.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="glass rounded-3xl p-6">
                    <Icon className="h-8 w-8 text-cyan" />
                    <h3 className="mt-5 text-xl font-black text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/62">{item.copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="faq" className="relative z-10 px-4 py-20">
          <div className="glass mx-auto max-w-4xl rounded-[32px] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan">FAQ</p>
            <h2 className="mt-4 text-3xl font-black text-white">Free file converter questions</h2>
            {[
              ["Is Neon Converter free?", "Yes. The included PDF, image, scanner, and OCR tools are free to use."],
              ["Are my files uploaded to a server?", "The current tools process files in your browser. That keeps the workflow fast and private."],
              ["Is this like iLovePDF or CamScanner?", "Yes, the goal is a free web toolkit for common PDF, image, scan cleanup, and OCR jobs."],
              ["Does it work on mobile?", "Yes. The interface is responsive and designed for phone upload workflows."]
            ].map(([question, answer]) => (
              <div key={question} className="mt-5 rounded-2xl bg-white/[0.06] p-5">
                <h3 className="font-black text-white">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-white/64">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="relative z-10 px-4 pb-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 py-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <span>Neon Converter · Free PDF tools · Free image converter · OCR scanner</span>
            <span className="inline-flex items-center gap-2"><Command className="h-4 w-4" /> Ctrl/⌘ K · <Globe2 className="h-4 w-4" /> SEO-ready · <Search className="h-4 w-4" /> Fast free tools</span>
          </div>
        </footer>
      </main>
    </>
  );
}

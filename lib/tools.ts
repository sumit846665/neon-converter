import {
  AudioWaveform,
  Bot,
  BrainCircuit,
  FileArchive,
  FileImage,
  FileLock2,
  FileText,
  FolderKanban,
  Image,
  Languages,
  LockKeyhole,
  Mic2,
  PenLine,
  Scissors,
  ShieldCheck,
  Sparkles,
  Video,
  WandSparkles,
  Zap
} from "lucide-react";
import type { ComponentType } from "react";

export type ToolItem = {
  name: string;
  description: string;
  category: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
};

export const toolCategories = [
  {
    name: "PDF AI Suite",
    tools: [
      "Merge PDF",
      "Split PDF",
      "Compress PDF",
      "Unlock PDF",
      "Protect PDF",
      "PDF to Word",
      "PDF to JPG",
      "OCR extraction",
      "Ask your PDF",
      "AI notes"
    ]
  },
  {
    name: "Image Lab",
    tools: [
      "JPG to PNG",
      "WEBP converter",
      "AI enhancer",
      "Background remover",
      "Upscaler",
      "Watermark remover",
      "Face cleanup",
      "Screenshot optimizer"
    ]
  },
  {
    name: "Media Forge",
    tools: [
      "MP4 converter",
      "Video compressor",
      "Audio extractor",
      "GIF creator",
      "Subtitle generator",
      "MP3 converter",
      "Noise remover",
      "Speech to text"
    ]
  },
  {
    name: "AI Workspace",
    tools: [
      "Document analyzer",
      "Resume builder",
      "Plagiarism checker",
      "Translator",
      "Smart search",
      "File categorizer",
      "Cloud folders",
      "Shared links"
    ]
  }
];

export const featuredTools: ToolItem[] = [
  {
    name: "Universal Converter Engine",
    description: "Auto-detects file types and routes PDFs, images, audio, video, and office docs into optimized pipelines.",
    category: "Automation",
    icon: Zap,
    accent: "from-cyan to-violet"
  },
  {
    name: "AI PDF Analyst",
    description: "Summaries, study notes, page extraction, citations, OCR, and a conversational PDF assistant.",
    category: "PDF",
    icon: BrainCircuit,
    accent: "from-magenta to-cyan"
  },
  {
    name: "Neon Image Studio",
    description: "Compress, resize, convert, upscale, sharpen, remove backgrounds, and restore imperfect screenshots.",
    category: "Image",
    icon: WandSparkles,
    accent: "from-lime to-cyan"
  },
  {
    name: "Encrypted Cloud Workspace",
    description: "Folders, recent files, shared links, autosave, realtime notifications, and expiring processing rooms.",
    category: "Cloud",
    icon: FolderKanban,
    accent: "from-violet to-magenta"
  },
  {
    name: "Voice and Media AI",
    description: "Clean audio, extract speech, generate subtitles, trim videos, and create shareable previews.",
    category: "Media",
    icon: AudioWaveform,
    accent: "from-cyan to-lime"
  },
  {
    name: "Secure Processing Layer",
    description: "JWT APIs, rate limits, encrypted temporary storage, protected uploads, and automated file deletion.",
    category: "Security",
    icon: ShieldCheck,
    accent: "from-magenta to-lime"
  }
];

export const quickActions = [
  { label: "Upload", icon: FileArchive },
  { label: "OCR", icon: FileText },
  { label: "Enhance", icon: FileImage },
  { label: "Protect", icon: FileLock2 },
  { label: "Sign", icon: PenLine },
  { label: "Trim", icon: Scissors },
  { label: "Translate", icon: Languages },
  { label: "Chat", icon: Bot },
  { label: "Video", icon: Video },
  { label: "Audio", icon: Mic2 },
  { label: "Images", icon: Image },
  { label: "Vault", icon: LockKeyhole },
  { label: "AI", icon: Sparkles }
];

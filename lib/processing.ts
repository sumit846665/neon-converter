export type ProcessingJob = {
  id: string;
  fileName: string;
  tool: string;
  progress: number;
  status: "Queued" | "Analyzing" | "Processing" | "Optimizing" | "Complete";
};

export const processingJobs: ProcessingJob[] = [
  { id: "fv-901", fileName: "InvestorDeck.pdf", tool: "AI PDF Summarizer", progress: 91, status: "Optimizing" },
  { id: "fv-447", fileName: "ProductScreens.webp", tool: "AI Upscaler", progress: 64, status: "Processing" },
  { id: "fv-222", fileName: "LectureAudio.wav", tool: "Speech-to-text AI", progress: 38, status: "Analyzing" },
  { id: "fv-118", fileName: "TaxFolder.zip", tool: "Smart Categorizer", progress: 17, status: "Queued" }
];

export const analytics = [
  { label: "Files processed", value: "24.8M", change: "+28%" },
  { label: "Avg. compression", value: "72%", change: "+11%" },
  { label: "AI minutes saved", value: "418K", change: "+36%" },
  { label: "Threats blocked", value: "99.99%", change: "Live" }
];

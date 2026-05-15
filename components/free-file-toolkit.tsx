"use client";

import imageCompression from "browser-image-compression";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import {
  Download,
  FileImage,
  FileText,
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  ScanText,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Wand2,
  X
} from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";
import { createWorker } from "tesseract.js";
import { type ComponentType, useMemo, useRef, useState } from "react";

type ToolId =
  | "merge-pdf"
  | "split-pdf"
  | "rotate-pdf"
  | "images-to-pdf"
  | "pdf-to-png"
  | "compress-image"
  | "resize-image"
  | "convert-image"
  | "scanner-clean"
  | "ocr-image";

type Tool = {
  id: ToolId;
  title: string;
  description: string;
  accepts: string;
  multiple: boolean;
  icon: ComponentType<{ className?: string }>;
};

const tools: Tool[] = [
  {
    id: "merge-pdf",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one downloadable PDF.",
    accepts: "application/pdf",
    multiple: true,
    icon: FileText
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description: "Export every PDF page as a separate PDF inside a ZIP.",
    accepts: "application/pdf",
    multiple: false,
    icon: FileText
  },
  {
    id: "rotate-pdf",
    title: "Rotate PDF",
    description: "Rotate all PDF pages by 90, 180, or 270 degrees.",
    accepts: "application/pdf",
    multiple: false,
    icon: RotateCcw
  },
  {
    id: "images-to-pdf",
    title: "JPG/PNG to PDF",
    description: "Turn images or scanned photos into a clean PDF document.",
    accepts: "image/png,image/jpeg,image/webp",
    multiple: true,
    icon: FileImage
  },
  {
    id: "pdf-to-png",
    title: "PDF to PNG",
    description: "Render PDF pages into PNG images and download a ZIP.",
    accepts: "application/pdf",
    multiple: false,
    icon: ImageIcon
  },
  {
    id: "compress-image",
    title: "Compress Image",
    description: "Reduce image size while keeping quality high.",
    accepts: "image/png,image/jpeg,image/webp",
    multiple: true,
    icon: ImageIcon
  },
  {
    id: "resize-image",
    title: "Resize Image",
    description: "Resize images to an exact width and export them.",
    accepts: "image/png,image/jpeg,image/webp",
    multiple: true,
    icon: ImageIcon
  },
  {
    id: "convert-image",
    title: "Convert Image",
    description: "Convert JPG, PNG, and WEBP images between common formats.",
    accepts: "image/png,image/jpeg,image/webp",
    multiple: true,
    icon: Wand2
  },
  {
    id: "scanner-clean",
    title: "Cam Scanner Clean",
    description: "Improve scanned pages with grayscale, contrast, and sharp text.",
    accepts: "image/png,image/jpeg,image/webp",
    multiple: true,
    icon: ScanText
  },
  {
    id: "ocr-image",
    title: "Image OCR",
    description: "Extract real text from screenshots, scans, and photos.",
    accepts: "image/png,image/jpeg,image/webp",
    multiple: false,
    icon: ScanText
  }
];

const imageTypes = [
  { label: "PNG", value: "image/png", extension: "png" },
  { label: "JPG", value: "image/jpeg", extension: "jpg" },
  { label: "WEBP", value: "image/webp", extension: "webp" }
];

function cleanName(name: string) {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]+/gi, "-").replace(/^-|-$/g, "") || "file";
}

function pdfBlob(bytes: Uint8Array) {
  const copy = new Uint8Array(bytes);
  return new Blob([copy.buffer], { type: "application/pdf" });
}

async function blobFromCanvas(canvas: HTMLCanvasElement, type = "image/png", quality = 0.92) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not export image."))), type, quality);
  });
}

async function loadBitmap(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function drawImageToCanvas(file: File, width?: number) {
  const image = await loadBitmap(file);
  const ratio = width ? width / image.naturalWidth : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width ?? image.naturalWidth));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

async function cleanScan(file: File) {
  const canvas = await drawImageToCanvas(file);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.data.length; i += 4) {
    const gray = data.data[i] * 0.299 + data.data[i + 1] * 0.587 + data.data[i + 2] * 0.114;
    const contrasted = gray > 180 ? 255 : gray < 90 ? 0 : Math.min(255, Math.max(0, (gray - 128) * 1.85 + 128));
    data.data[i] = contrasted;
    data.data[i + 1] = contrasted;
    data.data[i + 2] = contrasted;
  }
  ctx.putImageData(data, 0, 0);
  return blobFromCanvas(canvas, "image/png", 0.95);
}

export function FreeFileToolkit() {
  const [activeTool, setActiveTool] = useState<ToolId>("merge-pdf");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [resultText, setResultText] = useState("");
  const [error, setError] = useState("");
  const [quality, setQuality] = useState(0.72);
  const [resizeWidth, setResizeWidth] = useState(1200);
  const [rotateBy, setRotateBy] = useState(90);
  const [outputType, setOutputType] = useState("image/png");
  const inputRef = useRef<HTMLInputElement>(null);

  const tool = useMemo(() => tools.find((item) => item.id === activeTool) ?? tools[0], [activeTool]);
  const outputMeta = imageTypes.find((item) => item.value === outputType) ?? imageTypes[0];

  function pickTool(id: ToolId) {
    setActiveTool(id);
    setFiles([]);
    setResultText("");
    setError("");
    setProgress("");
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    setError("");
    setResultText("");
    const selected = Array.from(list);
    setFiles(tool.multiple ? selected : selected.slice(0, 1));
  }

  async function downloadZip(blobs: Array<{ name: string; blob: Blob }>, zipName: string) {
    const zip = new JSZip();
    blobs.forEach((item) => zip.file(item.name, item.blob));
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, zipName);
  }

  async function mergePdf() {
    const out = await PDFDocument.create();
    for (const [index, file] of files.entries()) {
      setProgress(`Reading PDF ${index + 1} of ${files.length}`);
      const input = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const copied = await out.copyPages(input, input.getPageIndices());
      copied.forEach((page) => out.addPage(page));
    }
    const bytes = await out.save();
    saveAs(pdfBlob(bytes), "merged-pdf.pdf");
  }

  async function splitPdf() {
    const file = files[0];
    const input = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const parts: Array<{ name: string; blob: Blob }> = [];
    for (const pageIndex of input.getPageIndices()) {
      setProgress(`Creating page ${pageIndex + 1} of ${input.getPageCount()}`);
      const out = await PDFDocument.create();
      const [page] = await out.copyPages(input, [pageIndex]);
      out.addPage(page);
      const bytes = await out.save();
      parts.push({ name: `${cleanName(file.name)}-page-${pageIndex + 1}.pdf`, blob: pdfBlob(bytes) });
    }
    await downloadZip(parts, `${cleanName(file.name)}-split-pages.zip`);
  }

  async function rotatePdf() {
    const file = files[0];
    const input = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    input.getPages().forEach((page) => page.setRotation(degrees(rotateBy)));
    const bytes = await input.save();
    saveAs(pdfBlob(bytes), `${cleanName(file.name)}-rotated.pdf`);
  }

  async function imagesToPdf() {
    const out = await PDFDocument.create();
    for (const [index, file] of files.entries()) {
      setProgress(`Adding image ${index + 1} of ${files.length}`);
      const bytes = await file.arrayBuffer();
      const isPng = file.type === "image/png";
      const embedded = isPng ? await out.embedPng(bytes) : await out.embedJpg(await normalizeToJpg(file));
      const page = out.addPage([embedded.width, embedded.height]);
      page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
    }
    const bytes = await out.save();
    saveAs(pdfBlob(bytes), "images-to-pdf.pdf");
  }

  async function normalizeToJpg(file: File) {
    if (file.type === "image/jpeg") return file.arrayBuffer();
    const canvas = await drawImageToCanvas(file);
    const blob = await blobFromCanvas(canvas, "image/jpeg", 0.92);
    return blob.arrayBuffer();
  }

  async function pdfToPng() {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
    const file = files[0];
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages: Array<{ name: string; blob: Blob }> = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      setProgress(`Rendering page ${pageNumber} of ${pdf.numPages}`);
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is not supported in this browser.");
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      pages.push({ name: `${cleanName(file.name)}-page-${pageNumber}.png`, blob: await blobFromCanvas(canvas, "image/png") });
    }
    await downloadZip(pages, `${cleanName(file.name)}-png-pages.zip`);
  }

  async function compressImages() {
    const outputs: Array<{ name: string; blob: Blob }> = [];
    for (const [index, file] of files.entries()) {
      setProgress(`Compressing image ${index + 1} of ${files.length}`);
      const blob = await imageCompression(file, {
        maxSizeMB: Math.max(0.05, quality * 2),
        maxWidthOrHeight: 2400,
        useWebWorker: true,
        initialQuality: quality
      });
      outputs.push({ name: `${cleanName(file.name)}-compressed.${file.type.includes("png") ? "png" : "jpg"}`, blob });
    }
    await downloadZip(outputs, "compressed-images.zip");
  }

  async function resizeImages() {
    const outputs: Array<{ name: string; blob: Blob }> = [];
    for (const [index, file] of files.entries()) {
      setProgress(`Resizing image ${index + 1} of ${files.length}`);
      const canvas = await drawImageToCanvas(file, resizeWidth);
      outputs.push({ name: `${cleanName(file.name)}-${resizeWidth}px.png`, blob: await blobFromCanvas(canvas, "image/png") });
    }
    await downloadZip(outputs, "resized-images.zip");
  }

  async function convertImages() {
    const outputs: Array<{ name: string; blob: Blob }> = [];
    for (const [index, file] of files.entries()) {
      setProgress(`Converting image ${index + 1} of ${files.length}`);
      const canvas = await drawImageToCanvas(file);
      outputs.push({ name: `${cleanName(file.name)}.${outputMeta.extension}`, blob: await blobFromCanvas(canvas, outputMeta.value, 0.92) });
    }
    await downloadZip(outputs, `converted-${outputMeta.extension}-images.zip`);
  }

  async function scannerClean() {
    const outputs: Array<{ name: string; blob: Blob }> = [];
    for (const [index, file] of files.entries()) {
      setProgress(`Cleaning scan ${index + 1} of ${files.length}`);
      outputs.push({ name: `${cleanName(file.name)}-scanner-clean.png`, blob: await cleanScan(file) });
    }
    await downloadZip(outputs, "scanner-clean-images.zip");
  }

  async function ocrImage() {
    const worker = await createWorker("eng");
    try {
      setProgress("Running OCR. This can take a moment on first use.");
      const { data } = await worker.recognize(files[0]);
      setResultText(data.text.trim() || "No text detected.");
    } finally {
      await worker.terminate();
    }
  }

  async function runTool() {
    if (!files.length) {
      setError("Please upload at least one file first.");
      return;
    }
    setBusy(true);
    setError("");
    setResultText("");
    setProgress("Starting...");
    try {
      if (activeTool === "merge-pdf") await mergePdf();
      if (activeTool === "split-pdf") await splitPdf();
      if (activeTool === "rotate-pdf") await rotatePdf();
      if (activeTool === "images-to-pdf") await imagesToPdf();
      if (activeTool === "pdf-to-png") await pdfToPng();
      if (activeTool === "compress-image") await compressImages();
      if (activeTool === "resize-image") await resizeImages();
      if (activeTool === "convert-image") await convertImages();
      if (activeTool === "scanner-clean") await scannerClean();
      if (activeTool === "ocr-image") await ocrImage();
      setProgress(activeTool === "ocr-image" ? "OCR complete." : "Done. Your download should start automatically.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong while processing the file.");
      setProgress("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="tools" className="relative z-10 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan">Free real tools</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">Convert, scan, resize, merge, split, and OCR files in your browser</h2>
          <p className="mt-5 text-base leading-7 text-white/68">
            No fake buttons. No pricing wall. Most tools run locally on your device, so files stay private and downloads are instant.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[340px_1fr]">
          <aside className="glass rounded-[28px] p-3">
            <div className="grid gap-2">
              {tools.map((item) => {
                const Icon = item.icon;
                const active = item.id === activeTool;
                return (
                  <button
                    key={item.id}
                    onClick={() => pickTool(item.id)}
                    className={`focus-ring flex items-center gap-3 rounded-2xl p-4 text-left transition ${
                      active ? "bg-cyan text-ink shadow-neon" : "bg-white/[0.05] text-white hover:bg-white/[0.1]"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>
                      <span className="block text-sm font-black">{item.title}</span>
                      <span className={`mt-1 block text-xs leading-5 ${active ? "text-ink/70" : "text-white/48"}`}>{item.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="glass rounded-[32px] p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-cyan">Selected tool</p>
                <h3 className="mt-2 text-3xl font-black text-white">{tool.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">{tool.description}</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-lime/25 bg-lime/10 px-3 py-2 text-xs font-bold text-lime">
                <ShieldCheck className="h-4 w-4" />
                Private local processing
              </div>
            </div>

            <div
              onDrop={(event) => {
                event.preventDefault();
                addFiles(event.dataTransfer.files);
              }}
              onDragOver={(event) => event.preventDefault()}
              className="mt-7 rounded-[28px] border border-dashed border-cyan/45 bg-cyan/5 p-6 text-center"
            >
              <UploadCloud className="mx-auto h-12 w-12 text-cyan" />
              <p className="mt-4 text-lg font-black text-white">Drop files here or choose from device</p>
              <p className="mt-2 text-sm text-white/52">
                {tool.multiple ? "Multiple files supported" : "Single file tool"} · Accepted: {tool.accepts.replaceAll(",", ", ")}
              </p>
              <input ref={inputRef} hidden type="file" accept={tool.accepts} multiple={tool.multiple} onChange={(event) => addFiles(event.target.files)} />
              <button onClick={() => inputRef.current?.click()} className="focus-ring mt-5 rounded-2xl bg-white px-6 py-3 font-black text-ink transition hover:bg-cyan">
                Choose files
              </button>
            </div>

            {files.length > 0 && (
              <div className="mt-5 rounded-3xl bg-white/[0.06] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-white">{files.length} file{files.length > 1 ? "s" : ""} ready</p>
                  <button onClick={() => setFiles([])} className="focus-ring rounded-xl p-2 text-white/62 hover:bg-white/10 hover:text-white" aria-label="Clear files">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 grid gap-2">
                  {files.map((file) => (
                    <div key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 rounded-2xl bg-ink/45 px-4 py-3 text-sm text-white/72">
                      <span className="truncate">{file.name}</span>
                      <span className="shrink-0 text-white/42">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-3">
              {activeTool === "compress-image" && (
                <label className="text-sm font-bold text-white">
                  Quality: {Math.round(quality * 100)}%
                  <input className="mt-3 w-full accent-cyan" type="range" min="0.25" max="0.95" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
                </label>
              )}
              {activeTool === "resize-image" && (
                <label className="text-sm font-bold text-white">
                  Width
                  <input className="mt-2 w-full rounded-2xl border border-white/10 bg-ink/60 px-4 py-3 text-white outline-none focus:border-cyan" type="number" min="64" max="6000" value={resizeWidth} onChange={(event) => setResizeWidth(Number(event.target.value))} />
                </label>
              )}
              {activeTool === "rotate-pdf" && (
                <label className="text-sm font-bold text-white">
                  Rotation
                  <select className="mt-2 w-full rounded-2xl border border-white/10 bg-ink/90 px-4 py-3 text-white outline-none focus:border-cyan" value={rotateBy} onChange={(event) => setRotateBy(Number(event.target.value))}>
                    <option value={90}>90 degrees</option>
                    <option value={180}>180 degrees</option>
                    <option value={270}>270 degrees</option>
                  </select>
                </label>
              )}
              {activeTool === "convert-image" && (
                <label className="text-sm font-bold text-white">
                  Output format
                  <select className="mt-2 w-full rounded-2xl border border-white/10 bg-ink/90 px-4 py-3 text-white outline-none focus:border-cyan" value={outputType} onChange={(event) => setOutputType(event.target.value)}>
                    {imageTypes.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </label>
              )}
              <div className="md:col-span-3">
                <button
                  onClick={runTool}
                  disabled={busy}
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan px-6 py-4 font-black text-ink shadow-neon transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                  {busy ? "Processing..." : `Run ${tool.title}`}
                </button>
              </div>
            </div>

            {(progress || error || resultText) && (
              <div className="mt-5 rounded-3xl bg-ink/55 p-5">
                {progress && <p className="text-sm font-bold text-cyan">{progress}</p>}
                {error && <p className="mt-2 text-sm font-bold text-red-300">{error}</p>}
                {resultText && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-black text-white">Extracted text</p>
                      <button onClick={() => navigator.clipboard.writeText(resultText)} className="rounded-xl bg-white px-3 py-2 text-xs font-black text-ink">Copy</button>
                    </div>
                    <textarea className="h-56 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-6 text-white outline-none" readOnly value={resultText} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

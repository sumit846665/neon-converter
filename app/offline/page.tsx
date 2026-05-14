export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-center text-white">
      <div className="glass max-w-lg rounded-[32px] p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan">FileVerse AI</p>
        <h1 className="mt-4 text-3xl font-black">Offline workspace ready</h1>
        <p className="mt-4 text-sm leading-6 text-white/70">
          Your queued file actions, recent workspace, and AI notes can remain available when the network drops.
        </p>
      </div>
    </main>
  );
}

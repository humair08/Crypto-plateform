export default function Loading() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <p className="text-white/70">Loading...</p>
      </div>
    </div>
  );
}

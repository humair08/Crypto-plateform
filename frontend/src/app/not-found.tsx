export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-heading font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-white/70 mb-8">Page not found</p>
        <a href="/" className="px-8 py-3 gradient-button text-white font-semibold rounded-lg inline-block">
          Go Home
        </a>
      </div>
    </div>
  );
}

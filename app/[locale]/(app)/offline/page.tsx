export default function OfflinePage() {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-6xl">🏋️</div>
      <h1 className="text-2xl font-bold">You&apos;re Offline</h1>
      <p className="max-w-md text-base-content/70">
        It looks like you&apos;ve lost your internet connection. Some features may not be available
        until you&apos;re back online.
      </p>
      <button
        className="btn btn-primary"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
}

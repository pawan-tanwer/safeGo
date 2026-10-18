export default function NoDriverFound({ onRetry }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0f1a17] text-white">
      <p className="text-lg font-semibold">No driver found nearby</p>
      <p className="text-sm text-gray-400">Please try again in a moment.</p>
      <button onClick={onRetry} className="rounded-lg bg-emerald-600 px-6 py-2">Try again</button>
    </div>
  );
}
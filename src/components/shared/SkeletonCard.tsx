export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-4 shadow-sm">
      <div className="aspect-square rounded-xl bg-gray-200" />

      <div className="mt-4 h-4 w-2/3 rounded bg-gray-200" />

      <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />

      <div className="mt-5 h-5 w-1/3 rounded bg-gray-200" />

      <div className="mt-5 h-10 rounded-xl bg-gray-200" />
    </div>
  );
}
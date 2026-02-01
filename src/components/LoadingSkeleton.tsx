export function LoadingSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="aspect-video bg-gray-200 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
      </div>
      <div className="flex gap-3">
        <div className="flex-1 h-14 bg-gray-200 rounded-2xl" />
        <div className="w-32 h-14 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
}

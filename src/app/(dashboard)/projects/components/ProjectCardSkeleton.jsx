export default function ProjectCardSkeleton() {
  return (
    <div className="bg-(--background) border border-slate-300 rounded-xl p-4 animate-pulse flex flex-col justify-between">
      {/* Top Section */}
      <div className="flex items-start mb-6">
        <div className="grow min-w-0">
          {/* Project Name Skeleton */}
          <div className="h-3 w-32 bg-slate-200 rounded mb-2"></div>

          {/* Description Skeleton */}
          <div className="h-2 w-48 bg-slate-200 rounded"></div>
        </div>

        {/* Dropdown Placeholder */}
        <div className="h-6 w-6 bg-slate-200 rounded-md"></div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-6 bg-slate-200 rounded"></div>
          <div className="h-4 w-4 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

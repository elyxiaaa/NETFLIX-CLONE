/**
 * Shimmer placeholder for a movie row. Card dimensions mirror `MovieCard` so
 * content swaps in without a layout jump.
 */
export function RowSkeleton({ poster = false }: { poster?: boolean }) {
  const card = poster
    ? "aspect-[2/3] w-[140px] sm:w-[150px] md:w-[170px]"
    : "aspect-video w-[220px] sm:w-[240px] md:w-[280px]";

  return (
    <div aria-hidden="true" className="space-y-3">
      <div className="mx-4 h-6 w-52 rounded bg-brand-gray/70 md:mx-12 shimmer" />
      <div className="flex gap-2.5 overflow-hidden px-4 md:px-12">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`shimmer shrink-0 rounded-lg bg-brand-gray ${card}`} />
        ))}
      </div>
    </div>
  );
}

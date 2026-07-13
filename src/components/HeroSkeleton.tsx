/** Shimmer placeholder shown in the hero slot while the featured title loads. */
export function HeroSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="relative h-[58vw] max-h-[82vh] min-h-[440px] w-full overflow-hidden bg-brand-dark"
    >
      <div className="shimmer absolute inset-0 bg-brand-gray/50" />
      {/* Match the real hero's gradient so the transition is seamless */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent" />

      <div className="absolute bottom-[20%] left-4 max-w-xl space-y-4 md:left-12">
        <div className="shimmer h-12 w-72 rounded bg-brand-gray md:h-16 md:w-96" />
        <div className="space-y-2 pt-2">
          <div className="shimmer h-3.5 w-full rounded bg-brand-gray" />
          <div className="shimmer h-3.5 w-11/12 rounded bg-brand-gray" />
          <div className="shimmer h-3.5 w-4/6 rounded bg-brand-gray" />
        </div>
        <div className="flex gap-3 pt-3">
          <div className="shimmer h-11 w-32 rounded bg-brand-gray" />
          <div className="shimmer h-11 w-36 rounded bg-brand-gray" />
        </div>
      </div>
    </section>
  );
}

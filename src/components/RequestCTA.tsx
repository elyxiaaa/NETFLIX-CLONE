/**
 * Community call-to-action — the one place the site asks for something back.
 *
 * Framed around requesting titles rather than "join our Discord", because the
 * ask lands better when it answers a problem the visitor already has: they
 * looked for something and we don't carry it.
 *
 * Rendered once per page from `Layout`, above the footer.
 */
import { DISCORD_URL } from "../config";
import { buttonClasses } from "./buttonStyles";
import { DiscordIcon } from "./icons";

export function RequestCTA({ className = "" }: { className?: string }) {
  return (
    <section className={`px-4 pb-4 pt-10 md:px-12 ${className}`}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-xl bg-brand-dark px-6 py-9 text-center ring-1 ring-white/10 sm:px-10">
        <span
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-full bg-brand-gold/10 ring-1 ring-brand-gold/25"
        >
          <DiscordIcon className="h-6 w-6 text-brand-gold" />
        </span>

        <div className="space-y-2">
          <h2 className="font-display text-3xl uppercase leading-none tracking-wide text-white sm:text-4xl">
            Can&apos;t find what you want?
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-white/60">
            Join our community and request any movie or series — tell us what to
            add next and we&apos;ll get it on the site.
          </p>
        </div>

        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noreferrer noopener"
          className={buttonClasses("primary", "lg")}
        >
          <DiscordIcon aria-hidden className="h-5 w-5" />
          Join Our Community
        </a>
      </div>
    </section>
  );
}

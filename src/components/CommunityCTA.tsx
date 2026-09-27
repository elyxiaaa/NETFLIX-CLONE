/**
 * Community call-to-action — the one place the site asks for something back.
 *
 * The pitch is continuity rather than chat: a site like this moves domains, and
 * Discord is how someone finds it again when it does. That's the strongest
 * reason to join, so it leads. Announcements and playback help follow.
 *
 * Rendered once per page from `Layout`, above the footer.
 */
import { DISCORD_URL } from "../config";
import { buttonClasses } from "./buttonStyles";
import { DiscordIcon } from "./icons";

/** What the server is actually used for — set expectations before the click. */
const TAGS = ["Site updates", "Report issues", "New links"];

export function CommunityCTA({ className = "" }: { className?: string }) {
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
            Don&apos;t lose access
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-white/60">
            Join our Discord for announcements, backup domains when the site
            moves, and help with playback or broken links.
          </p>
        </div>

        <ul className="flex flex-wrap justify-center gap-2">
          {TAGS.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/60 ring-1 ring-white/10"
            >
              {tag}
            </li>
          ))}
        </ul>

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

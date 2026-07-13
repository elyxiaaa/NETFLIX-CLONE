# Product

## Register

product

## Users

People deciding what to watch tonight. Lean-back, low-focus, often on a TV-adjacent or
large screen in a dim room. They arrive without a specific title in mind and want the
interface to surface something compelling fast. Secondary audience: engineers evaluating
this as a reference implementation / scaffold to wire a real TMDB backend into.

## Product Purpose

A cinematic content-discovery UI — a faithful, premium streaming "Browse" experience. Success is:
(1) it feels like the real thing at a glance, (2) a developer can swap in the live TMDB API
by changing one flag and one env var, and (3) the code is clean and modular enough to extend.

## Brand Personality

Cinematic, confident, immersive. The interface is a dark theater — it recedes so the artwork
glows. Voice is minimal and unfussy: posters and motion do the talking, not chrome or copy.

## Anti-references

- Generic Bootstrap/Material admin dashboards — flat, chrome-heavy, boxy cards with visible borders.
- Wireframe-gray placeholder UIs that look unfinished.
- Templated "icon + heading + text" identical card grids.
- Over-rounded, drop-shadowed "ghost cards." Premium streaming box art is edge-to-edge, near-square-cornered.

## Design Principles

1. **The artwork is the hero.** Chrome is near-invisible; posters and backdrops carry the surface.
2. **Earned familiarity.** Behaves exactly like a premium streaming app — hover-scale rows, billboard hero,
   detail modal. No reinvented affordances. The tool disappears into the task.
3. **Cinematic immersion.** Pure blacks, deep gradients, restrained red accent. It should feel
   like a dark theater, not a web app.
4. **Motion conveys state.** Hover, reveal, open/close — every animation reports a state change,
   never decoration.
5. **Swap-ready.** Mock and live data share one interface; components never learn where data comes from.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body/UI text ≥ 4.5:1 on its background. Modal is keyboard-complete
(focus trap, ESC to close, focus restore, `aria-modal`). All interactive controls are real
buttons with visible `:focus-visible` rings and accessible labels. Full
`prefers-reduced-motion` path (crossfades/instant, no scale or slide).

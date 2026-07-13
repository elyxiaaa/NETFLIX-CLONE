/**
 * UI overlay state: the detail modal AND the full-screen video player.
 *
 * Any card, row, or hero can `open(movie)` (details) or `play(movie)` (player).
 * Centralizing here means one `<DetailModal>` and one `<WatchPlayer>` mounted in
 * the layout read this state — no callback threading, only one of each ever open.
 */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Movie } from "../types/movie";

interface ModalContextValue {
  /** Movie whose details are open, or `null`. */
  selected: Movie | null;
  /** Movie playing in the full-screen player, or `null`. */
  playing: Movie | null;
  open: (movie: Movie) => void;
  close: () => void;
  /** Start playback (and dismiss the detail modal if open). */
  play: (movie: Movie) => void;
  stopPlaying: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Movie | null>(null);
  const [playing, setPlaying] = useState<Movie | null>(null);

  const value = useMemo<ModalContextValue>(
    () => ({
      selected,
      playing,
      open: (movie) => setSelected(movie),
      close: () => setSelected(null),
      play: (movie) => {
        setSelected(null);
        setPlaying(movie);
      },
      stopPlaying: () => setPlaying(null),
    }),
    [selected, playing],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a <ModalProvider>");
  }
  return ctx;
}

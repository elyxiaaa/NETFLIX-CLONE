/**
 * Detail-modal global state.
 *
 * Holds the single "currently-open" movie. Any card (in any row) or the hero can
 * call `open(movie)`; the single `<DetailModal>` mounted in `App` reads `selected`
 * and renders itself. Centralizing this avoids threading callbacks through every
 * row and card, and guarantees only one modal is ever open.
 */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Movie } from "../types/movie";

interface ModalContextValue {
  /** The movie whose details are open, or `null` when the modal is closed. */
  selected: Movie | null;
  open: (movie: Movie) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Movie | null>(null);

  const value = useMemo<ModalContextValue>(
    () => ({
      selected,
      open: (movie) => setSelected(movie),
      close: () => setSelected(null),
    }),
    [selected],
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

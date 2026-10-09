/* ============================================================
   Osorio Lab — ambient typings for anime.js v3.2.1 (CDN build)
   Covers exactly the API surface this codebase uses; the real
   type definitions live in the animejs package. This shim keeps
   the project dependency-free (no npm install to type-check).
   ============================================================ */

interface AnimeParams {
  /** Elements, selectors, objects of values, arrays… anything anime accepts. */
  targets?: unknown;
  duration?: number;
  /** A number or the stagger function returned by anime.stagger(). */
  delay?: unknown;
  easing?: string;
  autoplay?: boolean;
  loop?: boolean | number;
  direction?: string;
  /** Rounding for property values (1 = integers). */
  round?: number;
  /** Called on every animation frame with the animating instance. */
  update?: (instance: AnimeInstance) => void;
  /** Animated properties hit the index signature (opacity, translateY, …). */
  [property: string]: unknown;
}

interface AnimeAnimation {
  /** Current value of the animated property while updating. */
  currentValue: string | number;
}

interface AnimeInstance {
  /** Total duration of the instance/timeline in ms. */
  duration: number;
  /** Per-property animation records (used by counter updates). */
  animations: AnimeAnimation[];
  play(): AnimeInstance;
  pause(): AnimeInstance;
  restart(): AnimeInstance;
  seek(time: number): AnimeInstance;
  /** Timelines only: appends parameters at an offset ("-=260", absolute ms…). */
  add(params: AnimeParams, offset?: string | number): AnimeInstance;
}

declare function anime(params: AnimeParams): AnimeInstance;

declare namespace anime {
  function stagger(
    value?: number | string,
    options?: {
      start?: number;
      from?: "first" | "last" | "center" | number | [number, number];
      grid?: [number, number];
      axis?: "x" | "y";
      easing?: string;
    }
  ): unknown;
  function timeline(params?: AnimeParams): AnimeInstance;
}

interface Window {
  anime: typeof anime;
}
import { useEffect } from "react";

/**
 * Adds a short-lived `is-scrolling` class on scrollable elements during scroll (capture phase).
 */
export function useDocumentScrollIdleClass(): void {
  useEffect(() => {
    let timer: ReturnType<typeof window.setTimeout> | null = null;

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.scrollHeight > target.clientHeight) {
        target.classList.add("is-scrolling");
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          target.classList.remove("is-scrolling");
        }, 900);
      }
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    } as AddEventListenerOptions);

    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll, {
        capture: true,
      } as EventListenerOptions);
    };
  }, []);
}

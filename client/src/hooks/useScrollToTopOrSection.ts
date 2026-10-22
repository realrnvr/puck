import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const instantScrollPaths = ["/mangas"];

const useScrollToTopOrSection = (): void => {
  const { pathname, hash } = useLocation();
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    window.history.scrollRestoration = "manual";

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    const scrollBehavior: ScrollBehavior = reduceMotion
      ? "auto"
      : instantScrollPaths.includes(pathname)
        ? "instant"
        : "smooth";

    if (hash) {
      elRef.current = document.getElementById(hash.substring(1));
      if (elRef.current) {
        elRef.current.scrollIntoView({ behavior: scrollBehavior });
      }
    } else {
      window.scrollTo({ top: 0, behavior: scrollBehavior });
    }
  }, [pathname, hash]);
};

export default useScrollToTopOrSection;

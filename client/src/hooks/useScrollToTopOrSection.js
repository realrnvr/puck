import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const instantScrollPaths = ["/mangas"];

const useScrollToTopOrSection = () => {
  const { pathname, hash } = useLocation();
  const elRef = useRef(null);

  useEffect(() => {
    window.history.scrollRestoration = "manual";

    const scrollBehavior = instantScrollPaths.includes(pathname)
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

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const useScrollToTopOrSection = () => {
  const { pathname, hash } = useLocation();
  const elRef = useRef(null);

  useEffect(() => {
    if (hash) {
      elRef.current = document.getElementById(hash.substring(1));
      if (elRef.current) {
        elRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash]);
};

export default useScrollToTopOrSection;

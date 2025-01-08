import { useEffect } from "react";

export const useDisableScroll = (fsImg) => {
  useEffect(() => {
    if (fsImg) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [fsImg]);
};

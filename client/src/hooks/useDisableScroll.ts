import { useEffect } from "react";

export const useDisableScroll = (isState: boolean): void => {
  useEffect(() => {
    if (isState) {
      document.body.classList.add("no-scroll-fs");
    } else {
      document.body.classList.remove("no-scroll-fs");
    }

    return () => {
      document.body.classList.remove("no-scroll-fs");
    };
  }, [isState]);
};

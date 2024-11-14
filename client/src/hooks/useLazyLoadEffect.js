import { useEffect } from "react";
import { lazyLoading } from "../helper/lazyLoad";

export function useLazyLoadEffect({ carouselRef, lzImgsRef }) {
  useEffect(() => {
    const observer = lazyLoading({
      rootEl: carouselRef.current,
      lzImgs: lzImgsRef.current,
    });

    return () => {
      observer.disconnect();
    };
  }, [carouselRef, lzImgsRef]);
}

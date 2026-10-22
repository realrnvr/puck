import { useEffect, type RefObject } from "react";

interface LazyLoadEffectArgs {
  carouselRef: RefObject<Element | null> | null;
  lzImgsRef: RefObject<
    HTMLImageElement | Array<HTMLImageElement | null> | null
  >;
}

export function useLazyLoadEffect({
  carouselRef,
  lzImgsRef,
}: LazyLoadEffectArgs): void {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries?.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src as string;
            img.classList.remove("loading");
            img.classList.add("loaded");
            observerInstance.unobserve(img);
          }
        });
      },
      {
        root: carouselRef?.current,
        rootMargin: "100px",
        threshold: 0.01,
      },
    );

    if (Array.isArray(lzImgsRef.current)) {
      lzImgsRef.current.forEach((img) => {
        observer.observe(img as HTMLImageElement);
      });
    } else {
      observer.observe(lzImgsRef.current as HTMLImageElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [carouselRef, lzImgsRef]);
}

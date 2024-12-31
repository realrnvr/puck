import { useEffect } from "react";

export function useLazyLoadEffect({ carouselRef, lzImgsRef }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("loading");
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        });
      },
      {
        root: carouselRef.current,
        rootMargin: "100px",
        threshold: 0.01,
      }
    );

    lzImgsRef.current?.forEach((img) => {
      observer.observe(img);
    });

    return () => {
      observer.disconnect();
    };
  }, [carouselRef, lzImgsRef]);
}

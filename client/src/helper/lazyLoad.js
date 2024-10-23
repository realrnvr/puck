export const lazyLoading = ({ rootEl, lzImgs }) => {
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
      root: rootEl,
      rootMargin: "100px",
      threshold: 0.01,
    }
  );

  lzImgs?.forEach((img) => {
    observer.observe(img);
  });

  return observer;
};

import "./case-manga.css";
import { lazy, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import { usePrefetchSliderManga } from "../../../hooks/usePrefetchSliderManga";
const LazySliderBoxBase = lazy(() =>
  import("../../../services/sliderbox/SliderBoxBase")
);
// import SliderBoxBase from "../../../services/sliderbox/SliderBoxBase";
import SliderBoxSkeleton from "../../../services/sliderbox/skeleton/SliderBoxSkeleton";

const LIMIT = Number(import.meta.env.VITE_RANDOM_MANGA_SLIDER_LIMIT) || 5;

const CaseManga = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  usePrefetchSliderManga({ inView, LIMIT });

  return (
    <section className="case-manga">
      <div className="container">
        <h3 className="case-manga__title">Featured Collection</h3>
      </div>
      <div ref={ref} className="case-manga__slider">
        {inView ? (
          <Suspense fallback={<SliderBoxSkeleton />}>
            <LazySliderBoxBase />
          </Suspense>
        ) : (
          <SliderBoxSkeleton />
        )}
      </div>
    </section>
  );
};

export default CaseManga;

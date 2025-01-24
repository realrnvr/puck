// css
import "./slider-box-base.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
// plugins
import { carousel, plugins, slideshow, thumbnails } from "./config";
// skeleton
import SliderBoxSkeleton from "./skeleton/SliderBoxSkeleton";
// lightbox
import Lightbox from "yet-another-react-lightbox";
// hooks
import { useSliderManga } from "../../hooks/useSliderManga";
import SliderErrorPlaceholder from "./error/SliderErrorPlaceholder";

const SliderBoxBase = () => {
  const { slides, isLoading, isError } = useSliderManga();

  if (isLoading) {
    return <SliderBoxSkeleton />;
  }

  if (isError) {
    return <SliderErrorPlaceholder />;
  }

  return (
    <div className="slider">
      <Lightbox
        plugins={plugins}
        slideshow={slideshow}
        thumbnails={thumbnails}
        carousel={carousel}
        slides={slides}
        SliderPanelProps={{ isError }}
      />
    </div>
  );
};

export default SliderBoxBase;

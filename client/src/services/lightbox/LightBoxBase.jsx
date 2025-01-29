// css
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
// hooks
import { useChapter } from "../../hooks/useChapter";
// config
import { animation, carousel, plugins, zoom } from "./config";
// lightbox
import Lightbox from "yet-another-react-lightbox";
// other
import PropTypes from "prop-types";
import { memo } from "react";
import BackBtn from "./components/BackBtn";

const LightBoxBase = ({ mangaId }) => {
  const {
    slides,
    isChapterImage,
    isChapter,
    chapter,
    nav,
    isChapterError,
    isChapterImageError,
    isChapterFetching,
    isChapterImageFetching,
  } = useChapter(mangaId);

  return (
    <Lightbox
      plugins={plugins}
      slides={slides}
      zoom={zoom}
      carousel={carousel}
      animation={animation}
      MangaControllerProps={{
        chapter,
        nav,
        isChapterImage,
        isChapter,
        isChapterError,
        isChapterImageError,
        isChapterFetching,
        isChapterImageFetching,
      }}
      toolbar={{
        buttons: [<BackBtn key={"controller-back-btn"} />],
      }}
    />
  );
};

LightBoxBase.propTypes = {
  mangaId: PropTypes.string.isRequired,
};

export default memo(LightBoxBase);

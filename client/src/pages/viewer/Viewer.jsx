import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api/axios";
import { useParams } from "react-router-dom";

// plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Download from "yet-another-react-lightbox/plugins/download";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Counter from "yet-another-react-lightbox/plugins/counter";
// import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import { MangaControllerPlugin } from "../../plugin/MangaControllerPlugin";

// css
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./viewer.css";

const Viewer = () => {
  const [chapterCount, setChapterCount] = useState(0);

  const { mangaId } = useParams();

  const { data: chapter } = useQuery({
    queryKey: ["chapter", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/chapters/${mangaId}`),
  });

  const chapters = chapter?.data?.data;
  const chapterId = chapters && chapters[chapterCount]?.id;

  const { data, isPending } = useQuery({
    queryKey: ["chapter-image", { chapterId }],
    queryFn: () =>
      axiosInstance.get(`/api/v1/manga/chapter-image/${chapterId}`),
    enabled: !!chapterId,
  });

  const slides = isPending ? [] : data?.data?.data;

  return (
    <>
      <div className="viewer">
        <Lightbox
          plugins={[
            Fullscreen,
            Zoom,
            Captions,
            Download,
            Slideshow,
            Counter,
            // Thumbnails,
            MangaControllerPlugin,
          ]}
          open={true}
          slides={slides}
          zoom={{
            maxZoomPixelRatio: 2,
            zoomInMultiplier: 2,
            doubleClickMaxStops: 2,
            keyboardMoveDistance: 100,
            scrollToZoom: false,
          }}
          slideshow={{ finite: true }}
          thumbnails={{
            width: 50,
            height: 50,
            showToggle: true,
          }}
          animation={{
            zoom: 500,
          }}
          MangaControllerProps={{ chapterCount, setChapterCount, isPending }}
        />
      </div>
    </>
  );
};

export default Viewer;

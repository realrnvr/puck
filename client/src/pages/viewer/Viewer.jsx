import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api/axios";
import { useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";

// plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Download from "yet-another-react-lightbox/plugins/download";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Inline from "yet-another-react-lightbox/plugins/inline";
import { MangaControllerPlugin } from "../../plugin/MangaControllerPlugin";

// css
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "./viewer.css";

const CHUNK_SIZE = 100;

const Viewer = () => {
  const [chapterCount, setChapterCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [totalChapters, setTotalChapters] = useState(0);
  const [quality, setQuality] = useState("data");
  const [chapterBound, setChapterBound] = useState({
    first: 0,
    last: 0,
  });

  const { mangaId } = useParams();

  const { data: chapter } = useQuery({
    queryKey: ["chapter", { mangaId, CHUNK_SIZE, offset }],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/api/v1/manga/chapters/${mangaId}?limit=${CHUNK_SIZE}&offset=${offset}`
      );
      setTotalChapters(response.data.total);
      setChapterBound((prevChapterBound) => {
        return {
          ...prevChapterBound,
          first: response.data.data[0].attributes.chapter,
          last: response.data.data[response.data.data.length - 1].attributes
            .chapter,
        };
      });
      return response;
    },
  });

  const chapters = chapter?.data?.data;
  const chapterId = chapters && chapters[chapterCount]?.id;
  const currChapter = chapters && chapters[chapterCount]?.attributes?.chapter;
  const currVolume = chapters && chapters[chapterCount]?.attributes?.volume;

  const { data, isPending } = useQuery({
    queryKey: ["chapter-image", { chapterId, quality }],
    queryFn: () =>
      axiosInstance.get(`/api/v1/manga/chapter-image/${chapterId}`, {
        params: {
          quality: quality,
        },
      }),
    enabled: !!chapterId,
  });

  const slides = isPending ? [] : data?.data?.data;

  // memo chunk val
  const hasPrevChunk = useMemo(() => offset > 0, [offset]);
  const hasNextChunk = useMemo(
    () => offset + CHUNK_SIZE < totalChapters,
    [offset, totalChapters]
  );

  // handle chunk
  const handlePrevChunk = () => {
    if (hasPrevChunk) {
      setOffset((prev) => prev - CHUNK_SIZE);
      setChapterCount(0);
    }
  };

  const handleNextChunk = () => {
    if (hasNextChunk) {
      setOffset((prev) => prev + CHUNK_SIZE);
      setChapterCount(0);
    }
  };

  return (
    <>
      <div className="viewer">
        <Lightbox
          plugins={[
            Inline,
            Fullscreen,
            Zoom,
            Captions,
            Download,
            Slideshow,
            Counter,
            MangaControllerPlugin,
          ]}
          open={true}
          slides={slides}
          zoom={{
            maxZoomPixelRatio: 2,
            zoomInMultiplier: 2,
            doubleClickMaxStops: 2,
            keyboardMoveDistance: 100,
          }}
          carousel={{ finite: true }}
          animation={{
            zoom: 500,
          }}
          MangaControllerProps={{
            chapterCount,
            setChapterCount,
            isPending,
            currChapter,
            currVolume,
            chapters,
            nav: {
              hasPrevChunk,
              handlePrevChunk,
              hasNextChunk,
              handleNextChunk,
              totalChapters,
              chapterBound,
            },
            quality,
            setQuality,
          }}
        />
      </div>
    </>
  );
};

export default Viewer;

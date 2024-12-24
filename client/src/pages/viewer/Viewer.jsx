import "./viewer.css";

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
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

// css
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const Viewer = () => {
  const [open, setOpen] = useState(false);
  const { chapterId } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["chapter-image", { chapterId }],
    queryFn: () =>
      axiosInstance.get(`/api/v1/manga/chapter-image/${chapterId}`),
  });

  // const slides = [
  //   {
  //     src: "https://cmdxd98sb0x3yprd.mangadex.network/data/7dd9b16a7f83881121980b3bf685d5ff/x16-20a0d798987e0e161ffd977652662daafc04b15742042663de8f91aab1e2a018.jpg",
  //     downloadFilename: "berserk",
  //   },
  //   { src: "/berserk-manga-cover.jpg" },
  //   { src: "/vaga-bond-manga-cover.jpg" },
  //   { src: "/temp-cover.jpg" },
  // ];

  const slides = isPending ? [] : data?.data?.data;

  console.log(slides);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open Lightbox
      </button>
      <div className="viewer">
        <Lightbox
          plugins={[
            Fullscreen,
            Zoom,
            Captions,
            Download,
            Slideshow,
            Counter,
            Thumbnails,
          ]}
          open={open}
          close={() => setOpen(false)}
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
        />
      </div>
    </>
  );
};

export default Viewer;

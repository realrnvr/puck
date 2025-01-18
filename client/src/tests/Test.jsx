import "./test.css";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Inline from "yet-another-react-lightbox/plugins/inline";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { useQueries, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/api/axios";

const Test = () => {
  const { data } = useQuery({
    queryKey: ["random-manga-slider"],
    queryFn: () => axiosInstance.get("/api/v1/manga/random-manga?limit=5"),
  });

  console.log(data?.data?.manga);

  const mangaQueries = useQueries({
    queries:
      data?.data?.manga?.map((val) => {
        return {
          queryKey: ["manga-cover-slider", { mangaId: val.mangaId }],
          queryFn: () =>
            axiosInstance.get(`/api/v1/manga/cover/${val.mangaId}`),
        };
      }) ?? [],
    combine: (results) => {
      return {
        data: results.map((result) => {
          return { src: result?.data?.data.coverImgUrl };
        }),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  const slides = data?.data?.manga?.map((val, idx) => {
    return {
      ...mangaQueries?.data[idx],
      title: val.title,
      description: val.description,
    };
  });

  if (mangaQueries?.pending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="slider">
      <Lightbox
        open={true}
        plugins={[Thumbnails, Captions, Inline, Slideshow]}
        slideshow={{
          autoplay: true,
          delay: 5000,
        }}
        thumbnails={{
          width: 50,
          height: 50,
          vignette: true,
        }}
        carousel={{
          preload: 5,
        }}
        slides={slides}
      />
    </div>
  );
};

export default Test;

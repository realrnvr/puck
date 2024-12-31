import { useQueries } from "@tanstack/react-query";
import { memo } from "react";
import { axiosInstance } from "../services/api/axios";
import MangaCard from "./ui/mangaCard/MangaCard";
import Proptypes from "prop-types";

const MangaContainer = ({ caseManga }) => {
  const mangaQueries = useQueries({
    queries: caseManga.map((val) => {
      return {
        queryKey: ["manga-cover", { mangaId: val.mangaId }],
        queryFn: () => axiosInstance.get(`/api/v1/manga/cover/${val.mangaId}`),
      };
    }),
  });

  const isLoading = mangaQueries.some((query) => query.isLoading);

  const mangaData = caseManga.map((val, idx) => {
    return {
      ...val,
      img: mangaQueries[idx]?.data?.data?.coverImgUrl,
    };
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mangas__container">
      {mangaData?.map((val, idx) => {
        return (
          <MangaCard
            key={idx}
            img={val.img}
            title={val.title}
            mangaId={val.mangaId}
            authorId={val.authorId}
          />
        );
      })}
    </div>
  );
};

MangaContainer.propTypes = {
  caseManga: Proptypes.array,
};

export default memo(MangaContainer);

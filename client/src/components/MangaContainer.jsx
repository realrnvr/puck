// import { useQueries } from "@tanstack/react-query";
import { memo } from "react";
// import { axiosInstance } from "../services/api/axios";
// import MangaCard from "./ui/mangaCard/MangaCard";
import Proptypes from "prop-types";
import MangaLazyCard from "./MangaLazyCard";

const MangaContainer = ({ caseManga }) => {
  // const mangaQueries = useQueries({
  //   queries: caseManga.map((val) => {
  //     return {
  //       queryKey: ["manga-cover", { mangaId: val.mangaId }],
  //       queryFn: () => axiosInstance.get(`/api/v1/manga/cover/${val.mangaId}`),
  //     };
  //   }),
  // });

  // const mangaData = caseManga.map((val, idx) => {
  //   const query = mangaQueries[idx];
  //   return {
  //     ...val,
  //     img: query?.data?.data?.coverImgUrl,
  //     isLoading: query.isLoading,
  //   };
  // });

  return (
    <div className="mangas__container">
      {caseManga?.map((val, idx) => {
        return (
          <MangaLazyCard
            key={idx}
            mangaId={val.mangaId}
            title={val.title}
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

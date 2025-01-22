import "./read.css";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../services/api/axios";
import { useQuery } from "@tanstack/react-query";
import MangaCard from "../../components/ui/mangaCard/MangaCard";
import MangaCardSkeleton from "../../utils/skeletons/MangaCard/MangaCardSkeleton";
import MangaCardError from "../../utils/errors/MangaCardError";

const LIMIT = 8;

const Read = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["random-manga"],
    queryFn: () =>
      axiosInstance.get(`/api/v1/manga/random-manga?limit=${LIMIT}`),
  });

  return (
    <div className="read__manga | container">
      <div className="read__text-wrapper">
        <h3 className="read__manga-title">Read manga series!</h3>
        <Link to="/mangas" className="read__link lg-screen">
          See all manga series
        </Link>
      </div>
      <div className="read__manga-container">
        {data?.data?.manga.map((val, idx) => {
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
        {isPending ? <MangaCardSkeleton count={LIMIT} /> : null}
        {isError ? <MangaCardError count={LIMIT} /> : null}
      </div>
      <Link to="/mangas" className="read__link read__link--mt sm-screen">
        See all manga series
      </Link>
    </div>
  );
};

export default Read;

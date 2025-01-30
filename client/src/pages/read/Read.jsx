import "./read.css";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRandomManga } from "../../services/query/query";
import MangaCard from "../../components/ui/mangaCard/MangaCard";
import MangaCardError from "../../utils/errors/MangaCardError";
import MangaCardSkeleton from "../../utils/skeletons/mangaCard/MangaCardSkeleton";
import { usePrefetchInfiniteManga } from "../../hooks/usePrefetchInfiniteManga";

const LIMIT = 8;
const MANGAS_LIMIT = Number(import.meta.env.VITE_MANGAS_LIMIT) || 10;

const Read = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["random-manga"],
    queryFn: () => fetchRandomManga(LIMIT),
  });

  const { prefetch } = usePrefetchInfiniteManga(MANGAS_LIMIT);

  return (
    <div className="read__manga | container">
      <div className="read__text-wrapper">
        <h3 className="read__manga-title">Read manga series!</h3>
        <Link
          to="/mangas"
          className="read__link lg-screen"
          onMouseEnter={prefetch}
        >
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
      <Link
        to="/mangas"
        className="read__link read__link--mt sm-screen"
        onMouseEnter={prefetch}
      >
        See all manga series
      </Link>
    </div>
  );
};

export default Read;

import "./read.css";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRandomManga } from "../../services/query/query";
import { usePrefetchInfiniteManga } from "../../hooks/usePrefetchInfiniteManga";
import MangaCard from "../../components/ui/mangaCard/MangaCard";
import MangaCardError from "../../utils/errors/MangaCardError";
import MangaCardSkeleton from "../../utils/skeletons/mangaCard/MangaCardSkeleton";

const RANDOM_MANGA_LIMIT = Number(import.meta.env.VITE_RANDOM_MANGA_LIMIT) || 8;
const MANGAS_LIMIT = Number(import.meta.env.VITE_MANGAS_LIMIT) || 10;

const Read = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["random-manga", { RANDOM_MANGA_LIMIT }],
    queryFn: () => fetchRandomManga(RANDOM_MANGA_LIMIT),
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
              title={val.title}
              mangaId={val.mangaId}
              authorId={val.authorId}
            />
          );
        })}
        {isPending ? <MangaCardSkeleton count={RANDOM_MANGA_LIMIT} /> : null}
        {isError ? <MangaCardError count={RANDOM_MANGA_LIMIT} /> : null}
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

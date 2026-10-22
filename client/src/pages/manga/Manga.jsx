import "./manga.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMangaData } from "../../hooks/useMangaData";
import { usePrefetchChapter } from "../../hooks/usePrefetchChapter";
import GoBackBtn from "../../components/ui/goBackBtn/GoBackBtn";
import MangaDetails from "./MangaDetails";
import MangaHero from "./MangaHero";
import { getMangaView, isDexApiError } from "./mangaView";

const CHUNK_SIZE = Number(import.meta.env.VITE_CHUNK_SIZE) || 100;

const Manga = () => {
  const { mangaId, authorId } = useLoaderData();
  const navigate = useNavigate();

  const {
    statics,
    isStatics,
    isStaticsError,
    staticsError,
    authorData,
    isAuthor,
    isAuthorError,
    authorError,
    coverImg,
    isCover,
    isCoverError,
    manga,
    author,
    mangaData,
  } = useMangaData({ mangaId, authorId });

  const { prefetch } = usePrefetchChapter({ mangaId, CHUNK_SIZE });
  const view = getMangaView({ statics, authorData, coverImg });

  const handleNavigateClick = () => {
    navigate(`/viewer/${mangaId}`);
  };

  const isBtnDisabled =
    isDexApiError(staticsError) || isDexApiError(authorError);

  return (
    <>
      <img
        className="manga__bg-img"
        src={!isCoverError ? view.coverUrl : "/t-1px.webp"}
        alt=""
      />
      <article className="manga">
        <div className="manga__wrapper | container">
          <GoBackBtn />
          <MangaHero
            view={view}
            isCover={isCover}
            isCoverError={isCoverError}
            isStatics={isStatics}
            isStaticsError={isStaticsError}
            isAuthor={isAuthor}
            isAuthorError={isAuthorError}
          />
        </div>
        <MangaDetails
          view={view}
          manga={manga}
          mangaData={mangaData}
          mangaId={mangaId}
          author={author}
          isStatics={isStatics}
          isStaticsError={isStaticsError}
          isAuthor={isAuthor}
          isAuthorError={isAuthorError}
          isBtnDisabled={isBtnDisabled}
          onRead={handleNavigateClick}
          onPrefetch={prefetch}
        />
      </article>
    </>
  );
};

export default Manga;

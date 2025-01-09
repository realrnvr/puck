import "./read.css";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../services/api/axios";
import { useQuery } from "@tanstack/react-query";
import MangaCard from "../../components/ui/mangaCard/MangaCard";
import MangaCardSkeleton from "../../utils/skeletons/MangaCard/MangaCardSkeleton";

const LIMIT = 4;

const Read = () => {
  const { data, isPending } = useQuery({
    queryKey: ["random-manga"],
    queryFn: () =>
      axiosInstance.get(`/api/v1/manga/random-manga?limit=${LIMIT}`),
  });

  return (
    <>
      <article className="read">
        <div className="read__top-wrapper | container">
          <img src="/anime-bg.webp" className="read__img" alt="" />
          <div className="read__intro-container">
            <h2 className="read__title">READ</h2>
            <p className="read__description">
              Step into a world where ink meets magic. Each page is a portal,
              each panel a universe waiting to be discovered. Ready to turn the
              page? Your adventure starts now!
            </p>
          </div>
        </div>
        <div className="read__manga-wrapper">
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
            </div>
            <Link to="/mangas" className="read__link sm-screen">
              See all manga series
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};

export default Read;

import "./read.css";
import { Link } from "react-router-dom";
import MangaCard from "../../components/ui/mangaCard/MangaCard";

const Read = () => {
  const caseManga = [
    {
      img: "/berserk-manga-cover.jpg",
      title: "Berserk",
      mangaId: "801513ba-a712-498c-8f57-cae55b38cc92",
      authorId: "5863578d-4e4f-4b57-b64d-1dd45a893cb0",
    },
    {
      img: "/vaga-bond-manga-cover.jpg",
      title: "Vaga Bond",
      mangaId: "d1a9fdeb-f713-407f-960c-8326b586e6fd",
      authorId: "0b59098f-13c0-41cb-a110-9cbcec72dc0c",
    },
    {
      img: "/vinland-saga-manga-cover.jpg",
      title: "Vinland Saga",
      mangaId: "5d1fc77e-706a-4fc5-bea8-486c9be0145d",
      authorId: "f5d4fca1-d573-4383-af08-c06b0794ba4e",
    },
    {
      img: "/monster-manga-cover.jpg",
      title: "Monster",
      mangaId: "d9e30523-9d65-469e-92a2-302995770950",
      authorId: "508631f5-09de-4ae1-87ed-4b6179254ca1",
    },
  ];

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
              {caseManga.map((val, idx) => {
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

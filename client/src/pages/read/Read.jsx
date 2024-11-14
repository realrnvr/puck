import "./read.css";
import { Link } from "react-router-dom";
import MangaCard from "../../components/ui/mangaCard/MangaCard";

const Read = () => {
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
        {/* manga pieces */}
        <div className="read__manga-wrapper">
          <div className="read__manga | container">
            <h3 className="read__manga-title">Read manga series!</h3>
            <div className="read__manga-container">
              <MangaCard img={"berserk-manga-cover"} title={"Berserk"} />
              <MangaCard img={"vaga-bond-manga-cover"} title={"Vaga Bond"} />
              <MangaCard
                img={"vinland-saga-manga-cover"}
                title={"Vinland Saga"}
              />
              <MangaCard img={"monster-manga-cover"} title={"Monster"} />
            </div>
            <Link to="/goto" className="read__link">
              See all manga series
            </Link>
          </div>
        </div>
        {/* <div>manga here</div> */}
      </article>
    </>
  );
};

export default Read;

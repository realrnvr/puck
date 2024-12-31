import "./mangas.css";
import MangaContainer from "../../components/mangaContainer";
import { Link } from "react-router-dom";
import { caseManga } from "../../utils/MangaData";

const Mangas = () => {
  return (
    <section className="mangas | container">
      <Link to="/read">
        <div className="mangas__back">
          <svg
            className="mangas__arrow-svg"
            viewBox="0 0 512 512"
            fill="currentColor"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={48}
              d="M244 400L100 256l144-144M120 256h292"
            />
          </svg>
          <span className="mangas__span-text">Read</span>
        </div>
      </Link>
      <div className="mangas__content">
        <h2 className="mangas__title">Read The Hit Manga Series!</h2>
        <MangaContainer caseManga={caseManga} />
      </div>
    </section>
  );
};

export default Mangas;

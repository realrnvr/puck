import "./mangas.css";
import MangaContainer from "../../components/MangaContainer";
import GoBackBtn from "../../components/ui/goBackBtn/GoBackBtn";

const Mangas = () => {
  return (
    <section className="mangas | container">
      <GoBackBtn />
      <div className="mangas__content">
        <h2 className="mangas__title">Read The Hit Manga Series!</h2>
        <MangaContainer />
      </div>
    </section>
  );
};

export default Mangas;

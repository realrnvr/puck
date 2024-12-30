import "./viewer.css";
import { useParams } from "react-router-dom";
import LightBoxBase from "../../services/lightbox/LightBoxBase";

const Viewer = () => {
  const { mangaId } = useParams();

  return (
    <article className="viewer">
      <LightBoxBase mangaId={mangaId} />
    </article>
  );
};

export default Viewer;

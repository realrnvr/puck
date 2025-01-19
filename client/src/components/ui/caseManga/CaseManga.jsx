import "./case-manga.css";
import SliderBoxBase from "../../../services/sliderbox/SliderBoxBase";

const CaseManga = () => {
  return (
    <section className="case-manga">
      <div className="container">
        <h3 className="case-manga__title">Featured Collection</h3>
      </div>
      <div className="case-manga__slider">
        <SliderBoxBase />
      </div>
    </section>
  );
};

export default CaseManga;

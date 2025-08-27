import "./sm-text-carousel.css";
import { textData } from "../../../../assets/data/textCarouselData";
import PropTypes from "prop-types";

const SmTextCarousel = ({ reversed }) => {
  return (
    <div className="sm-text-carousel">
      {textData.map((val, index) => {
        return (
          <div
            key={index}
            className="sm-text-wrapper__element"
            style={{
              animationDelay: `calc(var(--sm-text-duration) / ${textData.length} * (${textData.length} - ${index}) * -1)`,
              animationDirection: reversed === true ? "reverse" : "normal",
            }}
          >
            <p className="sm-text-wrapper__text">{val}</p>
          </div>
        );
      })}
    </div>
  );
};

SmTextCarousel.propTypes = {
  reversed: PropTypes.bool,
};

export default SmTextCarousel;

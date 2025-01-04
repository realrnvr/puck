import "./text-carousel.css";
import { memo } from "react";
import PropTypes from "prop-types";

const TextCarousel = ({ reversed, rotate }) => {
  const textData = ["WATCH ANIME", "READ MANGA", "WATCH ANIME", "READ MANGA"];
  return (
    <div className="text-carousel">
      {textData.map((val, index) => {
        return (
          <div
            key={index}
            className="text-carousel__text"
            style={{
              "--n": index + 1,
              animationDirection: reversed ? "reverse" : "normal",
            }}
          >
            <p
              className="text-carousel__title"
              style={{ transform: rotate && "rotate(180deg)" }}
            >
              {val}
            </p>
          </div>
        );
      })}
    </div>
  );
};

TextCarousel.propTypes = {
  reversed: PropTypes.bool,
  rotate: PropTypes.bool,
};

export default memo(TextCarousel);

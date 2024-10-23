import React from "react";
import "./sm-text-carousel.css";

const SmTextCarousel = ({ reversed }) => {
  const textData = ["WATCH ANIME", "READ MANGA", "WATCH ANIME", "READ ANIME"];
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

export default SmTextCarousel;

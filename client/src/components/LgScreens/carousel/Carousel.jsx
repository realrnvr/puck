import React, { memo, useRef } from "react";
import { useLazyLoadEffect } from "../../../hooks/useLazyLoadEffect";
import "./carousel.css";

const Carousel = ({ data, reversed }) => {
  const carouselRef = useRef(null);
  const lzImgsRef = useRef([]);

  useLazyLoadEffect({
    carouselRef,
    lzImgsRef,
  });

  return (
    <div
      ref={carouselRef}
      className="carousel"
      style={{ height: `calc(var(--lg-size) * ${data.length})` }}
    >
      {data.map((val, index) => {
        return (
          <div
            key={index}
            className="carousel__element"
            style={{
              animationDirection: reversed ? "reverse" : "normal",
              animationDelay: `calc(var(--lg-duration) / ${data.length} * (${
                data.length
              } - ${index + 1}) * -1)`,
            }}
          >
            <img
              ref={(el) => (lzImgsRef.current[index] = el)}
              className="carousel__img | loading lazy"
              src="https://fakeimg.pl/150"
              data-src={val.imgSrc}
              alt={val.imgAlt}
            />
          </div>
        );
      })}
    </div>
  );
};

export default memo(Carousel);

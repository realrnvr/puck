import React, { memo, useRef } from "react";
import { useLazyLoadEffect } from "../../../hooks/useLazyLoadEffect";
import "./sm-carousel.css";

const SmCarousel = ({ data, reversed }) => {
  const carouselRef = useRef(null);
  const lzImgsRef = useRef([]);

  useLazyLoadEffect({
    carouselRef,
    lzImgsRef,
  });

  return (
    <div ref={carouselRef} className="sm-carousel">
      {data.map((val, index) => {
        return (
          <div
            key={index}
            className="sm-carousel__element"
            style={{
              "--n": index + 1,
              animationDirection: reversed ? "reverse" : "normal",
            }}
          >
            <img
              ref={(el) => (lzImgsRef.current[index] = el)}
              className="sm-carousel__img | loading sm-lazy"
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

export default memo(SmCarousel);

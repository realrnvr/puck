import React from "react";
import "./showcase.css";

const Showcase = ({ title }) => {
  return (
    <article className="showcase | section-mg-top">
      <div className="showcase__bg-img-wrapper">
        <img className="showcase__bg-img" src="/anime-bg.webp" alt="" />
      </div>
      <div className="showcase__content | container">
        <div className="showcase__navigation">
          <h2 className="showcase__title">{title}</h2>
          <a className="showcase__link" href="#">
            See all
          </a>
        </div>
        <div className="showcase__container">
          <div className="showcase__card">
            <figure className="showcase__figure">
              <div className="showcase__img-wrapper">
                <img
                  className="showcase__img"
                  src="/berserk-manga.webp"
                  alt=""
                />
              </div>
              <figcaption className="showcase__caption">
                Berserk: 1997 anime
              </figcaption>
            </figure>
          </div>
          <div className="showcase__card">
            <figure className="showcase__figure">
              <div className="showcase__img-wrapper">
                <img
                  className="showcase__img"
                  src="/berserk-manga.webp"
                  alt=""
                />
              </div>
              <figcaption className="showcase__caption">
                Berserk: 1997 anime
              </figcaption>
            </figure>
          </div>
          <div className="showcase__card">
            <figure className="showcase__figure">
              <div className="showcase__img-wrapper">
                <img
                  className="showcase__img"
                  src="/berserk-manga.webp"
                  alt=""
                />
              </div>
              <figcaption className="showcase__caption">
                Berserk: 1997 anime
              </figcaption>
            </figure>
          </div>
          <div className="showcase__card">
            <figure className="showcase__figure">
              <div className="showcase__img-wrapper">
                <img
                  className="showcase__img"
                  src="/berserk-manga.webp"
                  alt=""
                />
              </div>
              <figcaption className="showcase__caption">
                Berserk: 1997 anime
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Showcase;

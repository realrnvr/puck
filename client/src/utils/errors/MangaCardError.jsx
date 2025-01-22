import { Fragment } from "react";

const MangaCardError = ({ count = 1 }) => {
  return Array.from({ length: count }, (_, idx) => {
    return (
      <Fragment key={idx}>
        <div className="manga-card__skeleton-container">
          <div className="manga-card__skeleton-btn"></div>
          <figure className="manga-card__skeleton">
            <div className="manga-card__skeleton-img"></div>
            <img className="manga-card__img" src="/t-1px.webp" />
            <div className="manga-card__caption">
              <h2 className="manga-card__title">------</h2>
            </div>
          </figure>
        </div>
      </Fragment>
    );
  });
};

export default MangaCardError;

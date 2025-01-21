import "./watch.css";

const Watch = () => {
  return (
    <>
      <img
        src="/pattern-5.svg"
        className="read__bg-img"
        alt="pattern"
        aria-hidden="true"
      />
      <article className="read">
        <div className="read__top-wrapper | container">
          <div className="read__intro-container">
            <h2 className="read__title">Watch</h2>
            <p className="read__description">
              From action-packed adventures to heartwarming tales, explore a
              diverse collection of anime and watch it all in one place.
            </p>
          </div>
        </div>
        <div className="read__manga-wrapper">
          <div className="watch">
            <div className="placeholder">
              <p className="community__text">
                This feature is coming soon. Stay tuned!
              </p>
              <img
                className="community__placeholder"
                src="/pattern-3.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default Watch;

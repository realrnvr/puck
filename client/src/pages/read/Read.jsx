import "./read.css";

const Read = () => {
  return (
    <>
      <article className="read | container">
        <div className="read__top-wrapper">
          <div className="read__img-wrapper">
            <img src="/anime-bg.webp" className="read__img" alt="" />
          </div>
          <div className="read__intro-container">
            <h2 className="read__title">READ</h2>
            <p className="read__description">
              Step into a world where ink meets magic. Each page is a portal,
              each panel a universe waiting to be discovered. Ready to turn the
              page? Your adventure starts now!
            </p>
          </div>
        </div>
        {/* <div>manga here</div> */}
      </article>
    </>
  );
};

export default Read;

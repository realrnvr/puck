import "./community.css";

const Community = () => {
  return (
    <>
      <img
        src="/pattern-6.svg"
        className="read__bg-img"
        alt="pattern"
        aria-hidden="true"
      />
      <article className="read">
        <div className="read__top-wrapper | container">
          <div className="read__intro-container">
            <h2 className="read__title read__title--fs">Community</h2>
            <p className="read__description">
              Connect with fellow manga and anime enthusiasts! Share your
              thoughts, discuss favorites, and discover recommendations in a
              vibrant and welcoming space.
            </p>
          </div>
        </div>
        <div className="read__manga-wrapper">
          <div className="com">
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

export default Community;

import "./news-letter.css";

const NewsLetter = () => {
  return (
    <section className="newsletter">
      <div className="newsletter__content | section-mg-top container">
        <div className="newsletter__l-container">
          <h2 className="newsletter__title">
            Get the latest manga & anime news!
          </h2>
          <p className="newsletter__description">
            You will never miss a beat when you subscribe to our newsletter.
          </p>
          <div className="newletter__input-wrapper">
            <input
              className="newsletter__input"
              type="text"
              placeholder="Enter your Email"
            />
            <button className="newsletter__btn">Sign up</button>
          </div>
        </div>
        <div className="newsletter__r-container">
          <img className="newsletter__img" src="/news-letter.webp" alt="" />
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;

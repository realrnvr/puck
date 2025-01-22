import "./about.css";

const About = () => {
  return (
    <div className="about | container">
      <div>
        <h3 className="about__title">Welcome to PUCK</h3>
        <p className="about__description about__description--mt">
          Your ultimate destination for all things anime and manga! At PUCK,
          we&apos;re passionate about connecting fans with the worlds they love,
          whether it&apos;s through watching epic anime series or exploring
          captivating manga stories.
        </p>
      </div>
      <div>
        <h3 className="about__title">Our Mission</h3>
        <p className="about__description about__description--mt">
          To bring the vibrant world of anime and manga to life for fans
          everywhere. We aim to create a space where enthusiasts can explore,
          discover, and celebrate the art and stories that define this unique
          culture.
        </p>
      </div>
      <div>
        <h3 className="about__title">What We Offer</h3>
        <div className="about__description-container">
          <p className="about__description about__description--mt">
            <strong className="about__description-title">Stream Anime:</strong>{" "}
            From the latest episodes to timeless classics, watch your favorite
            series in high quality.
          </p>
          <p className="about__description">
            <strong className="about__description-title">Explore Manga:</strong>{" "}
            Dive into a library of manga titles, from action-packed adventures
            to heartwarming tales.
          </p>
          <p className="about__description">
            <strong className="about__description-title">Community hub:</strong>{" "}
            Connect with fellow fans, share your thoughts, and join the
            conversation about your favorite series.
          </p>
          <p className="about__description">
            <strong className="about__description-title">
              News & Updates:
            </strong>{" "}
            Stay up-to-date with the latest anime and manga releases, news, and
            trends.
          </p>
        </div>
      </div>
      <div>
        <h3 className="about__title">Our Motivation</h3>
        <div className="about__description-container">
          <p className="about__description about__description--mt">
            At PUCK, this journey is deeply personal. Anime and manga have been
            a significant part of my life, teaching me valuable lessons,
            inspiring me, and providing endless joy. This website is my way of
            giving back to the amazing community that has shaped me.
          </p>
          <p className="about__description">
            Through PUCK, I aim to pay homage to the vibrant world of anime and
            manga and contribute to the community. This platform is my way of
            sharing that passion and creating a space where fans like you can
            come together and celebrate what we love.
          </p>
          <p className="about__description">
            I understand that there are still features to be added, but this is
            only the beginning. I am fully committed to growing PUCK and
            improving it with time. As I continue to learn and put in the
            effort, those features will find their way here. Together, we can
            make this platform even better, one step at a time.
          </p>
          <p className="about__description about__description--fw-fs">
            culture shouldn&apos;t exist only for those who can afford it!
          </p>
          <p className="about__description">
            Thank you for being part of this journey!
          </p>
        </div>
      </div>
      <div>
        <h3 className="about__title">Credits</h3>
        <div className="about__description-container">
          <p className="about__description about__description--mt">
            Special thanks to{" "}
            <strong className="about__description-title">MangaDex</strong> for
            providing an incredible platform and API that allows fans to explore
            and enjoy manga from around the world.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

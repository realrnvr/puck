import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer | section-mg-top container">
      <div className="footer__navigation">
        <h2 className="footer__title">PUCK</h2>
        <nav className="footer__nav">
          <ul className="footer__ul">
            <li className="footer__li">
              <a className="footer__link" href="#">
                Read
              </a>
            </li>
            <li className="footer__li">
              <a className="footer__link" href="#">
                Watch
              </a>
            </li>
            <li className="footer__li">
              <a className="footer__link" href="#">
                Community
              </a>
            </li>
            <li className="footer__li">
              <a className="footer__link" href="#">
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="footer__contact">
        <div className="footer__img-wrapper">
          <img className="footer__img" src="/footer-filler.webp" alt="" />
        </div>
        <div className="footer__contact-text">
          <h3 className="footer__text">Contact us:</h3>
          <p className="footer__para">
            Email:{" "}
            <a className="footer__link" href="#">
              info@puck.com
            </a>
          </p>
        </div>
      </div>
      <hr className="footer__hr" />
      <div className="footer__bottom">
        <p className="footer__para">@2024 PUCK.</p>
      </div>
    </footer>
  );
};

export default Footer;

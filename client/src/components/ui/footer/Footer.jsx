import "./footer.css";
import HeaderNavLink from "../../HeaderNavLink";
import { useLazyLoadEffect } from "../../../hooks/useLazyLoadEffect";
import { useRef } from "react";

const Footer = () => {
  const imgRef = useRef(null);

  useLazyLoadEffect({ carouselRef: null, lzImgsRef: imgRef });

  return (
    <footer className="footer | section-mg-top">
      <div className="footer__content | container">
        <div className="footer__navigation">
          <h2 className="footer__title">PUCK</h2>
          <nav className="footer__nav">
            <ul className="footer__ul">
              <HeaderNavLink value={"read"} />
              <HeaderNavLink value={"watch"} />
              <HeaderNavLink value={"community"} />
              <HeaderNavLink value={"about"} />
            </ul>
          </nav>
        </div>
        <div className="footer__contact">
          <div className="footer__img-wrapper">
            <img
              ref={imgRef}
              className="footer__img | loading"
              src="/t-1px.webp"
              data-src={"/footer-filler.webp"}
              alt="footer-img"
              aria-hidden={true}
            />
          </div>
          <div className="footer__contact-text">
            <h3 className="footer__text">Contact us:</h3>
            <a className="footer__link" href="mailto:realrnvr@gmail.com">
              realrnvr@gmail.com
            </a>
          </div>
        </div>
        <hr className="footer__hr" />
        <div className="footer__bottom">
          <p className="footer__para">@2024 PUCK</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

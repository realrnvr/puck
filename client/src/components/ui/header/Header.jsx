import "./header.css";
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useDisableScroll } from "../../../hooks/useDisableScroll";
import { usePrefetchRandomManga } from "../../../hooks/usePrefetchRandomManga";
import Search from "../../Search";
import HeaderUtilities from "../../HeaderUtilities";
import HeaderNavLink from "../../HeaderNavLink";
import HeaderGoto from "../../HeaderGoto";

const RANDOM_MANGA_LIMIT = Number(import.meta.env.VITE_RANDOM_MANGA_LIMIT) || 8;

const Header = () => {
  const [MobileMenu, setMobileMenu] = useState(false);

  useDisableScroll(MobileMenu);
  const { prefetch } = usePrefetchRandomManga(RANDOM_MANGA_LIMIT);

  const toggleMobileMenu = () => {
    setMobileMenu((prevMobileMenu) => {
      return !prevMobileMenu;
    });
  };

  const handleNavClick = () => {
    setMobileMenu(false);
  };

  return (
    <header className="header">
      <div className="header__sec-nav-wrapper header__lg-screen">
        <nav className="container" aria-label="Secondary Navigation">
          <ul className="header__sec-ul">
            <li>
              <h2 className="header__title">Manga & Anime</h2>
            </li>
            <HeaderGoto
              title={"Berserk"}
              mangaId={"801513ba-a712-498c-8f57-cae55b38cc92"}
              authorId={"5863578d-4e4f-4b57-b64d-1dd45a893cb0"}
            />
            <HeaderGoto
              title={"Monster"}
              mangaId={"d9e30523-9d65-469e-92a2-302995770950"}
              authorId={"508631f5-09de-4ae1-87ed-4b6179254ca1"}
            />
            <HeaderGoto
              title={"Bleach"}
              mangaId={"239d6260-d71f-43b0-afff-074e3619e3de"}
              authorId={"246984d8-340d-4544-871b-c962da4bb28b"}
            />
            <HeaderGoto
              title={"Naruto"}
              mangaId={"6b1eb93e-473a-4ab3-9922-1a66d2a29a4a"}
              authorId={"7f718dfa-e5be-45ea-a5cb-0fcd3ed52d5f"}
            />
            <HeaderGoto
              title={"Vinland Saga"}
              mangaId={"5d1fc77e-706a-4fc5-bea8-486c9be0145d"}
              authorId={"f5d4fca1-d573-4383-af08-c06b0794ba4e"}
            />
            <HeaderGoto
              title={"Death Note"}
              mangaId={"75ee72ab-c6bf-4b87-badd-de839156934c"}
              authorId={"0669bf79-ca27-4f50-9b48-741fb235137f"}
            />
          </ul>
        </nav>
      </div>
      <div className="header__main-wrapper">
        <div className="header__main | container">
          <button
            className="header__btn header__btn--opacity header__sm-screen"
            onClick={toggleMobileMenu}
            style={MobileMenu ? { opacity: 0 } : null}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="header__icon"
              aria-hidden="true"
              color="#fff"
            >
              <path
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <span className="visually-hidden">Open Menu</span>
          </button>
          <nav
            className="header__pri-nav header__lg-screen"
            aria-label="Primary Navigation"
          >
            <div className="header__actions">
              <HeaderUtilities />
              <Search />
            </div>
            <div>
              <ul className="header__pri-ul header__pri-ul--flex-d">
                <HeaderNavLink
                  value={"read"}
                  onMouseEnter={prefetch}
                  onTouchStart={prefetch}
                />
                <HeaderNavLink value={"watch"} />
                <HeaderNavLink value={"community"} />
                <HeaderNavLink value={"about"} />
              </ul>
            </div>
          </nav>
          <div className="header__img-wrapper">
            <Link to="/">
              <img
                className="header__img"
                src="/puckImg.webp"
                alt="logo"
                aria-hidden="true"
              />
              <span className="visually-hidden">Go to Home page</span>
            </Link>
          </div>
        </div>
      </div>
      <div
        className="header__mobile-nav-wrapper"
        style={
          MobileMenu
            ? {
                transform: "translateX(0%)",
                opacity: "1",
                visibility: "visible",
              }
            : null
        }
      >
        <div className="header__mobile-nav">
          <button
            className="header__btn header__btn--border"
            onClick={toggleMobileMenu}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="header__icon"
              color="#fff"
            >
              <path strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <span className="visually-hidden">Close Menu</span>
          </button>
          <HeaderUtilities onClick={handleNavClick} />
        </div>
        <nav className="header__mobile-pri-nav" aria-label="Primary Navigation">
          <ul className="header__mobile-pri-ul">
            <HeaderNavLink value={"read"} onClick={handleNavClick} />
            <HeaderNavLink value={"watch"} onClick={handleNavClick} />
            <HeaderNavLink value={"community"} onClick={handleNavClick} />
            <HeaderNavLink value={"about"} onClick={handleNavClick} />
          </ul>
          <Search onClick={handleNavClick} />
        </nav>
        <nav
          className="header__mobile-sec-nav"
          aria-label="Secondary Navigation"
        >
          <h3 className="header__title">Manga & Anime</h3>
          <ul className="header__mobile-sec-ul">
            <div className="header__mobile-sec-li-wrapper">
              <HeaderGoto
                title={"Berserk"}
                mangaId={"801513ba-a712-498c-8f57-cae55b38cc92"}
                authorId={"5863578d-4e4f-4b57-b64d-1dd45a893cb0"}
                onClick={handleNavClick}
              />
              <HeaderGoto
                title={"Monster"}
                mangaId={"d9e30523-9d65-469e-92a2-302995770950"}
                authorId={"508631f5-09de-4ae1-87ed-4b6179254ca1"}
                onClick={handleNavClick}
              />
              <HeaderGoto
                title={"Bleach"}
                mangaId={"239d6260-d71f-43b0-afff-074e3619e3de"}
                authorId={"246984d8-340d-4544-871b-c962da4bb28b"}
                onClick={handleNavClick}
              />
            </div>
            <div className="header__mobile-sec-li-wrapper">
              <HeaderGoto
                title={"Naruto"}
                mangaId={"6b1eb93e-473a-4ab3-9922-1a66d2a29a4a"}
                authorId={"7f718dfa-e5be-45ea-a5cb-0fcd3ed52d5f"}
                onClick={handleNavClick}
              />
              <HeaderGoto
                title={"Vinland Saga"}
                mangaId={"5d1fc77e-706a-4fc5-bea8-486c9be0145d"}
                authorId={"f5d4fca1-d573-4383-af08-c06b0794ba4e"}
                onClick={handleNavClick}
              />
              <HeaderGoto
                title={"Death Note"}
                mangaId={"75ee72ab-c6bf-4b87-badd-de839156934c"}
                authorId={"0669bf79-ca27-4f50-9b48-741fb235137f"}
                onClick={handleNavClick}
              />
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default memo(Header);

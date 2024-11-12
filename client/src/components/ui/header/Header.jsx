import "./header.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/api/axios";

const Header = () => {
  const [MobileMenu, setMobileMenu] = useState(false);
  const auth = useAuth();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: () => axiosInstance.post("/api/v1/auth/logout"),
    onSuccess: () => {
      auth.setToken(null);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const user = () => {
    if (auth.token) {
      const payload = jwtDecode(auth.token);
      return payload.username;
    }

    return null;
  };

  const toggleMobileMenu = () => {
    setMobileMenu((prevMobileMenu) => {
      return !prevMobileMenu;
    });
  };

  return (
    <header className="header">
      <div className="header__sec-nav-wrapper header__lg-screen">
        <nav className="container" aria-label="Secondary Navigation">
          <ul className="header__sec-ul">
            <li>
              <h2 className="header__title">Manga & Anime</h2>
            </li>
            <li>
              <Link className="header__sec-link" to="/berserk">
                Berserk
              </Link>
            </li>
            <li>
              <Link className="header__sec-link" to="/monster">
                Monster
              </Link>
            </li>
            <li>
              <Link className="header__sec-link" to="/bleach">
                Bleach
              </Link>
            </li>
            <li>
              <Link className="header__sec-link" to="/naruto">
                Naruto
              </Link>
            </li>
            <li>
              <Link className="header__sec-link" to="/vinland-saga">
                Vinland Saga
              </Link>
            </li>
            <li>
              <Link className="header__sec-link" to="/death-note">
                Death Note
              </Link>
            </li>
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
              xmlns="http://www.w3.org/2000/svg"
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
              <ul className="header__utilities">
                {user() ? (
                  <>
                    <li>
                      <span className="header__nav-btn">{user()}</span>
                    </li>
                    <li>
                      <button
                        className="login__btn"
                        style={{ backgroundColor: "grey" }}
                        onClick={logoutMutate}
                      >
                        Log out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="header__nav-btn" to="/login">
                        Log in
                      </Link>
                    </li>
                    <li>
                      <Link className="header__nav-btn" to="/signup">
                        Sign up
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="header__icon header__icon--width"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                    <span className="visually-hidden">My Favorites</span>
                  </Link>
                </li>
              </ul>
              {/* <Link className="header__link" to="/account">
                  My Account
                </Link> */}
              <div>
                <form
                  className="header__form"
                  aria-label="Search Manga and Anime"
                >
                  <input
                    type="text"
                    name="search"
                    className="header__input"
                    placeholder="Search"
                  />
                  <button
                    className="header__btn header__search-btn"
                    aria-label="Submit"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="header__icon header__icon--width header__icon--color"
                    >
                      <path
                        d="M6.38 0A6.3 6.3 0 000 6.23a6.3 6.3 0 006.38 6.24c1.26 0 2.43-.36 3.41-.97L14.4 16l1.6-1.56-4.55-4.43a6.1 6.1 0 001.31-3.78A6.3 6.3 0 006.38 0zm0 1.47c2.7 0 4.88 2.12 4.88 4.76A4.82 4.82 0 016.38 11 4.82 4.82 0 011.5 6.23a4.82 4.82 0 014.88-4.76z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
            <div>
              <ul className="header__pri-ul header__pri-ul--flex-d">
                <li>
                  <Link className="header__pri-link" to="/read">
                    Read
                  </Link>
                </li>
                <li>
                  <Link className="header__pri-link" to="/watch">
                    Watch
                  </Link>
                </li>
                <li>
                  <Link className="header__pri-link" to="/community">
                    Community
                  </Link>
                </li>
                <li>
                  <Link className="header__pri-link" to="/about">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <div className="header__img-wrapper">
            <Link to="/">
              <img
                className="header__img"
                src="/puckImg.webp"
                alt=""
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
              xmlns="http://www.w3.org/2000/svg"
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

          {/* <Link className="header__link" to="/account">
              My Account
            </Link> */}
          <ul className="header__utilities">
            {user() ? (
              <>
                <li>
                  <span className="header__nav-btn">{user()}</span>
                </li>
                <li>
                  <button
                    className="login__btn"
                    style={{ backgroundColor: "grey" }}
                    onClick={logoutMutate}
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link className="header__nav-btn" to="/login">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link className="header__nav-btn" to="/signup">
                    Sign up
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="header__icon header__icon--width"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                <span className="visually-hidden">My Favorites</span>
              </Link>
            </li>
          </ul>
        </div>
        <nav className="header__mobile-pri-nav" aria-label="Primary Navigation">
          <ul className="header__mobile-pri-ul">
            <li>
              <Link className="header__pri-link" to="/read">
                Read
              </Link>
            </li>
            <li>
              <Link className="header__pri-link" to="/watch">
                Watch
              </Link>
            </li>
            <li>
              <Link className="header__pri-link" to="/community">
                Community
              </Link>
            </li>
            <li>
              <Link className="header__pri-link" to="/about">
                About
              </Link>
            </li>
          </ul>
          <form className="header__form" aria-label="Search Manga and Anime">
            <input
              type="text"
              name="search"
              placeholder="Search"
              className="header__input"
            />
            <button
              className="header__btn header__search-btn"
              aria-label="Submit"
            >
              <svg
                viewBox="0 0 16 16"
                className="header__icon header__icon--width header__icon--color"
              >
                <path
                  d="M6.38 0A6.3 6.3 0 000 6.23a6.3 6.3 0 006.38 6.24c1.26 0 2.43-.36 3.41-.97L14.4 16l1.6-1.56-4.55-4.43a6.1 6.1 0 001.31-3.78A6.3 6.3 0 006.38 0zm0 1.47c2.7 0 4.88 2.12 4.88 4.76A4.82 4.82 0 016.38 11 4.82 4.82 0 011.5 6.23a4.82 4.82 0 014.88-4.76z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </form>
        </nav>
        <nav
          className="header__mobile-sec-nav"
          aria-label="Secondary Navigation"
        >
          <h3 className="header__title">Manga & Anime</h3>
          <ul className="header__mobile-sec-ul">
            <div className="header__mobile-sec-li-wrapper">
              <li>
                <Link className="header__sec-link" to="/berserk">
                  Berserk
                </Link>
              </li>
              <li>
                <Link className="header__sec-link" to="/monster">
                  Monster
                </Link>
              </li>
              <li>
                <Link className="header__sec-link" to="/bleach">
                  Bleach
                </Link>
              </li>
            </div>
            <div className="header__mobile-sec-li-wrapper">
              <li>
                <Link className="header__sec-link" to="/naruto">
                  Naruto
                </Link>
              </li>
              <li>
                <Link className="header__sec-link" to="/vinland-saga">
                  Vinland Saga
                </Link>
              </li>
              <li>
                <Link className="header__sec-link" to="/death-note">
                  Death Note
                </Link>
              </li>
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

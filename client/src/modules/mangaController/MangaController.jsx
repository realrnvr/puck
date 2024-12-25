import { useState } from "react";
import "./manga-controller.css";
import PropTypes from "prop-types";
import Loader from "../../components/ui/loader/Loader";

export function MangaController({
  children,
  MangaControllerProps: { setChapterCount, isPending },
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {children}
      <button
        type="button"
        className="controller__close-btn"
        onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
      >
        {isOpen ? (
          <svg
            className="controller__close-svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11 8.414V18h2V8.414l4.293 4.293 1.414-1.414L12 4.586l-6.707 6.707 1.414 1.414z" />
          </svg>
        ) : (
          <svg
            className="controller__close-svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.707 12.707l-1.414-1.414L13 15.586V6h-2v9.586l-4.293-4.293-1.414 1.414L12 19.414z" />
          </svg>
        )}
      </button>
      <div className={`controller ${isOpen ? "controller-close" : null}`}>
        <div className="controller__container-left">
          <div>
            <label htmlFor="read">You are reading, by:</label>
            <select name="read" id="read">
              <option value="chapter">Chapter</option>
            </select>
          </div>
          <select name="language" id="language">
            <option value="en">language: EN</option>
            <option value="ja">Language: JA</option>
          </select>
          <p>setting</p>
        </div>
        <div className="controller__container-right">
          <div className="controller__btn-wrapper">
            <button type="button" className="controller__list-btn">
              <span>Chapter - 0.02</span>
              <svg
                className="controller__list-svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 110 8a8 8 0 0116 0zM8.5 4.5a.5.5 0 00-1 0v5.793L5.354 8.146a.5.5 0 10-.708.708l3 3a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L8.5 10.293V4.5z" />
              </svg>
            </button>
            <div className="controller__nav">
              <button
                type="button"
                className="controller__nav-btn"
                onClick={() =>
                  setChapterCount((prevChapterCount) => prevChapterCount - 1)
                }
              >
                <svg
                  className="controller__nav-svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path d="M18.464 2.114a.998.998 0 00-1.033.063l-13 9a1.003 1.003 0 000 1.645l13 9A1 1 0 0019 21V3a1 1 0 00-.536-.886zM17 19.091L6.757 12 17 4.909v14.182z" />
                </svg>
              </button>
              <button
                type="button"
                className="controller__nav-btn"
                onClick={() =>
                  setChapterCount((prevChapterCount) => prevChapterCount + 1)
                }
              >
                <svg
                  className="controller__nav-svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path d="M5.536 21.886a1.004 1.004 0 001.033-.064l13-9a1 1 0 000-1.644l-13-9A.998.998 0 005 3v18a1 1 0 00.536.886zM7 4.909L17.243 12 7 19.091V4.909z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="controller__loader">{isPending ? <Loader /> : null}</div>
    </>
  );
}

MangaController.propTypes = {
  children: PropTypes.node.isRequired,
  MangaControllerProps: PropTypes.object,
};

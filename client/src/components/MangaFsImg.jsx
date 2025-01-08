import { useState } from "react";
import { useDisableScroll } from "../hooks/useDisableScroll";
import PropTypes from "prop-types";

const MangaFsImg = ({ coverImgUrl }) => {
  const [fsImg, setFsImg] = useState(false);

  useDisableScroll(fsImg);

  return (
    <>
      <button
        className="manga__full-screen-button"
        onClick={() => setFsImg(true)}
      >
        <svg
          className="manga__full-screen-svg"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707m0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707m-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707"
          />
        </svg>
      </button>
      {fsImg ? (
        <div
          className="manga__fs-img-wrapper"
          onClick={(e) => {
            setFsImg(false);
            e.stopPropagation();
          }}
        >
          <img
            className="manga__fs-img"
            src={coverImgUrl || "/t-1px.webp"}
            alt=""
          />
        </div>
      ) : null}
    </>
  );
};

MangaFsImg.propTypes = {
  coverImgUrl: PropTypes.string,
};

export default MangaFsImg;

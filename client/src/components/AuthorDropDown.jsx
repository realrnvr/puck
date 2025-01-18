import { memo, useState } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import Markdown from "../utils/markdown/Markdown";

const AuthorDropDown = ({ author, name, isAuthor }) => {
  const [drop, setDrop] = useState(false);

  return (
    <>
      <div className="manga__drop-down">
        {isAuthor ? (
          <Skeleton
            baseColor="#202020"
            highlightColor="#444"
            width={"150px"}
            height={"30px"}
          />
        ) : (
          <p className="manga__author manga__author-tag">{name}</p>
        )}
        {author ? (
          <button
            className="manga__drop-down-btn"
            onClick={() => setDrop((prevDrop) => !prevDrop)}
          >
            {drop ? (
              <svg className="manga__drop-down-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M8.12 14.71L12 10.83l3.88 3.88a.996.996 0 1 0 1.41-1.41L12.7 8.71a.996.996 0 0 0-1.41 0L6.7 13.3a.996.996 0 0 0 0 1.41c.39.38 1.03.39 1.42 0"
                ></path>
              </svg>
            ) : (
              <svg className="manga__drop-down-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6z"
                ></path>
              </svg>
            )}
          </button>
        ) : null}
      </div>
      {drop ? (
        <Markdown content={author} className="manga__static-content" />
      ) : null}
    </>
  );
};

AuthorDropDown.propTypes = {
  author: PropTypes.string,
  name: PropTypes.string,
  isAuthor: PropTypes.bool,
};

export default memo(AuthorDropDown);

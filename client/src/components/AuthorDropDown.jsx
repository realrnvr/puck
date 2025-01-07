import { memo, useState } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

const AuthorDropDown = ({ process, name, isAuthor }) => {
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
        {process ? (
          <button
            className="manga__btn manga__btn--flex-none"
            onClick={() => setDrop((prevDrop) => !prevDrop)}
          >
            {drop ? (
              <img className="manga__icon" src="/arrow-up.svg" alt="" />
            ) : (
              <img className="manga__icon" src="/arrow-down.svg" alt="" />
            )}
          </button>
        ) : null}
      </div>
      {drop ? (
        <p
          className="manga__description manga__description--mt"
          dangerouslySetInnerHTML={{ __html: process }}
        ></p>
      ) : null}
    </>
  );
};

AuthorDropDown.propTypes = {
  process: PropTypes.string,
  name: PropTypes.string,
  isAuthor: PropTypes.bool,
};

export default memo(AuthorDropDown);

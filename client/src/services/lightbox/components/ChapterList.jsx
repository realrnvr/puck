import PropTypes from "prop-types";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";

const ChapterList = ({ chapters, setChapter, chapterCount, isChapter }) => {
  return (
    <ul className="controller__chapter-list">
      {isChapter
        ? Array.from({ length: 8 }, (_, idx) => {
            return (
              <Skeleton
                key={idx}
                baseColor="#202020"
                highlightColor="#444"
                height={"100%"}
                width={"100%"}
              />
            );
          })
        : chapters?.map((val, idx) => {
            return (
              <li
                key={idx}
                className="controller__chapter-li"
                onClick={() => setChapter(idx)}
              >
                <button
                  className="controller__chapter-btn"
                  style={{
                    backgroundColor: chapterCount === idx ? "orange" : null,
                  }}
                >
                  <p className="controller__chapter-details">
                    Chapter - {val?.attributes?.chapter}
                  </p>
                  <p className="controller__chapter-details">
                    {val?.attributes?.title || "----"}
                  </p>
                </button>
              </li>
            );
          })}
    </ul>
  );
};

ChapterList.propTypes = {
  chapters: PropTypes.array,
  setChapter: PropTypes.func,
  chapterCount: PropTypes.number,
  isChapter: PropTypes.bool,
};

export default memo(ChapterList);

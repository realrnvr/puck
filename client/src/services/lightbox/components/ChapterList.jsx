import PropTypes from "prop-types";
import { memo } from "react";

const ChapterList = ({ chapters, setChapterCount, chapterCount }) => {
  return (
    <ul className="controller__chapter-list">
      {chapters?.map((val, idx) => {
        return (
          <li
            key={idx}
            className="controller__chapter-li"
            onClick={() => setChapterCount(idx)}
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
  setChapterCount: PropTypes.func,
  chapterCount: PropTypes.number,
};

export default memo(ChapterList);

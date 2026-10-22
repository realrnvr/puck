import { memo, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import ErrorComp from "../../../utils/errorComp/ErrorComp";
import PropTypes from "prop-types";

const ChapterList = ({
  chapters,
  setChapter,
  chapterCount,
  isChapter,
  isChapterError,
  isOpen,
}) => {
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current && isOpen) {
      const container = activeRef.current.parentElement;

      const reduceMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      )?.matches;

      container.scrollTo({
        top: activeRef.current.offsetTop - container.clientHeight / 2,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  }, [chapters, chapterCount, isOpen]);

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
            const isActive = chapterCount === idx;
            return (
              <li
                key={idx}
                className="controller__chapter-li"
                ref={isActive ? activeRef : null}
              >
                <button
                  type="button"
                  className="controller__chapter-btn"
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setChapter(idx)}
                  style={{
                    backgroundColor: isActive ? "orange" : null,
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
      {isChapterError ? <ErrorComp height="60px" count={8} /> : null}
    </ul>
  );
};

ChapterList.propTypes = {
  chapters: PropTypes.array,
  setChapter: PropTypes.func,
  chapterCount: PropTypes.number,
  isChapter: PropTypes.bool,
  isChapterError: PropTypes.bool,
  isOpen: PropTypes.bool,
};

export default memo(ChapterList);

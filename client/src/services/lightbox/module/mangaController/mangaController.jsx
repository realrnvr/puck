import "./manga-controller.css";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import PropTypes from "prop-types";
import Loader from "../../../../components/ui/loader/Loader";
import ChapterList from "../../components/ChapterList";
import Button from "../../components/Button";
import Skeleton from "react-loading-skeleton";

function MangaController({
  children,
  MangaControllerProps: { chapter, nav, isChapterImage, isChapter },
}) {
  const [isOpen, setIsOpen] = useLocalStorage("isOpen", false);

  const handleToggleButton = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <>
      {children}
      <Button
        isOpen={isOpen}
        onClick={handleToggleButton}
        className={"controller__close-btn"}
      />
      <div className={`controller ${isOpen ? "controller-close" : null}`}>
        <div className="controller__container-right">
          <div className="controller__top-container">
            <div className="controller__btn-wrapper">
              <button
                type="button"
                className={`controller__nav-btn ${
                  chapter.hasChapterPrev || isChapter ? "disabled__btn" : null
                }`}
                disabled={chapter.hasChapterPrev || isChapter}
                onClick={chapter.prevChapter}
              >
                <svg
                  className="controller__nav-svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.464 2.114a.998.998 0 00-1.033.063l-13 9a1.003 1.003 0 000 1.645l13 9A1 1 0 0019 21V3a1 1 0 00-.536-.886zM17 19.091L6.757 12 17 4.909v14.182z" />
                </svg>
              </button>
              <div className="controller__counter controller__curr-chapter">
                {isChapter ? (
                  <Skeleton
                    baseColor="#202020"
                    highlightColor="#444"
                    className="controller__counter-skeleton"
                  />
                ) : (
                  <>
                    <span>Chapter - {chapter.currChapter}</span>
                    <svg
                      className="controller__list-svg"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 110 8a8 8 0 0116 0zM8.5 4.5a.5.5 0 00-1 0v5.793L5.354 8.146a.5.5 0 10-.708.708l3 3a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L8.5 10.293V4.5z" />
                    </svg>
                  </>
                )}
              </div>
              <button
                type="button"
                className={`controller__nav-btn ${
                  chapter.hasChapterNext || isChapter ? "disabled__btn" : null
                }`}
                disabled={chapter.hasChapterNext || isChapter}
                onClick={chapter.nextChapter}
              >
                <svg
                  className="controller__nav-svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5.536 21.886a1.004 1.004 0 001.033-.064l13-9a1 1 0 000-1.644l-13-9A.998.998 0 005 3v18a1 1 0 00.536.886zM7 4.909L17.243 12 7 19.091V4.909z" />
                </svg>
              </button>
              <div className="controller__counter controller__vol-lg-screen">
                {isChapter ? (
                  <Skeleton
                    baseColor="#202020"
                    highlightColor="#444"
                    className="controller__counter-skeleton"
                  />
                ) : (
                  <>
                    <span>Volume - {chapter.currVolume}</span>
                    <svg
                      className="controller__list-svg"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 110 8a8 8 0 0116 0zM8.5 4.5a.5.5 0 00-1 0v5.793L5.354 8.146a.5.5 0 10-.708.708l3 3a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L8.5 10.293V4.5z" />
                    </svg>
                  </>
                )}
              </div>
            </div>
            {isChapter ? (
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                className="controller__tc-skeleton"
              />
            ) : (
              <p className="controller__chap-count controller__lg-screen">
                Total chapters - {chapter.totalChapters}
              </p>
            )}
            {isChapter ? (
              <div className="controller__tc-skeleton-sm-wrapper">
                <Skeleton
                  baseColor="#202020"
                  highlightColor="#444"
                  width={"50px"}
                  height={"20px"}
                />
              </div>
            ) : (
              <p className="controller__chap-count controller__sm-screen">
                {chapter.totalChapters}
              </p>
            )}
          </div>
          <ChapterList
            chapters={chapter.chapters}
            setChapter={chapter.setChapter}
            chapterCount={chapter.state.chapterCount}
            isChapter={isChapter}
          />
        </div>
        <div className="controller__container-left">
          <div className="controller__drop-down">
            <label htmlFor="quality">Quality</label>
            {isChapterImage || isChapter ? (
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"100%"}
                width={"9ch"}
              />
            ) : (
              <select
                className="controller__select"
                name="quality"
                id="quality"
                value={chapter.state.quality}
                onChange={chapter.handleQualityChange}
              >
                <option className="controller__option" value="data">
                  Original
                </option>
                <option className="controller__option" value="data-saver">
                  Data saver
                </option>
              </select>
            )}
          </div>
          <div className="controller__pag">
            <button
              className={`controller__pag-btn ${
                !nav.hasPrevChunk || isChapter ? "disabled__btn" : null
              }`}
              type="button"
              onClick={nav.handlePrevChunk}
              disabled={!nav.hasPrevChunk}
            >
              <svg
                className="controller__pg-svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 19h18a1.002 1.002 0 00.823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 003 19zm9-12.243L19.092 17H4.908L12 6.757z" />
              </svg>
            </button>
            {isChapter ? (
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"20px"}
                width={"80px"}
              />
            ) : (
              <p className="controller__pag-counter">
                {chapter.chapterBound.first} - {chapter.chapterBound.last}
              </p>
            )}
            <button
              className={`controller__pag-btn ${
                !nav.hasNextChunk || isChapter ? "disabled__btn" : null
              }`}
              type="button"
              onClick={nav.handleNextChunk}
              disabled={!nav.hasNextChunk || isChapter}
            >
              <svg
                className="controller__pg-svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.886 5.536A1.002 1.002 0 0021 5H3a1.002 1.002 0 00-.822 1.569l9 13a.998.998 0 001.644 0l9-13a.998.998 0 00.064-1.033zM12 17.243L4.908 7h14.184L12 17.243z" />
              </svg>
            </button>
          </div>
          <Button
            isOpen={isOpen}
            onClick={handleToggleButton}
            className={"controller__close-btn-sm"}
          />
        </div>
      </div>
      <div className="controller__loader">
        {isChapterImage ? <Loader /> : null}
      </div>
    </>
  );
}

MangaController.propTypes = {
  children: PropTypes.node.isRequired,
  MangaControllerProps: PropTypes.object,
};

export default MangaController;

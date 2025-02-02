import "./manga-controller.css";
import { useLocalStorage } from "../../../../hooks/useLocalStorage";
import PropTypes from "prop-types";
import Loader from "../../../../components/ui/loader/Loader";
import ChapterList from "../../components/ChapterList";
import Button from "../../components/Button";
import Skeleton from "react-loading-skeleton";
import ErrorComp from "../../../../utils/errorComp/ErrorComp";
import NavButton from "../../components/NavButton";
import ArrowDownBorder from "../../svgs/ArrowDownBorder";

function MangaController({
  children,
  MangaControllerProps: {
    chapter,
    nav,
    isChapterImage,
    // isChapterImageError,
    isChapter,
    isChapterError,
    isChapterFetching,
    isChapterImageFetching,
  },
}) {
  const [isOpen, setIsOpen] = useLocalStorage("isOpen", true);

  const handleToggleButton = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <>
      {children}
      {isChapterFetching || isChapterImageFetching ? (
        <div className="controller__fetch-loader">
          <Loader />
        </div>
      ) : null}
      <Button
        isOpen={isOpen}
        onClick={handleToggleButton}
        className={"controller__close-btn"}
      />
      <div className={`controller ${isOpen ? "controller-close" : null}`}>
        <div className="controller__container-right">
          <div className="controller__top-container">
            <div className="controller__btn-wrapper">
              <NavButton
                onClick={chapter.prevChapter}
                disabled={chapter.hasChapterPrev || isChapter || isChapterError}
                type="left"
              />
              <div className="controller__counter controller__curr-chapter">
                {isChapter ? (
                  <Skeleton
                    baseColor="#202020"
                    highlightColor="#444"
                    className="controller__counter-skeleton"
                  />
                ) : (
                  <>
                    <span className="controller__current-count">
                      Chapter - {chapter.currChapter || "--"}
                    </span>
                    <ArrowDownBorder />
                  </>
                )}
              </div>
              <NavButton
                onClick={chapter.nextChapter}
                disabled={chapter.hasChapterNext || isChapter || isChapterError}
                type="right"
              />
              <div className="controller__counter controller__vol-lg-screen">
                {isChapter ? (
                  <Skeleton
                    baseColor="#202020"
                    highlightColor="#444"
                    className="controller__counter-skeleton"
                  />
                ) : (
                  <>
                    <span className="controller__current-count">
                      Volume - {chapter.currVolume || "--"}
                    </span>
                    <ArrowDownBorder />
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
                Total chapters - {chapter.totalChapters || "--"}
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
                {chapter.totalChapters || "--"}
              </p>
            )}
          </div>
          <ChapterList
            chapters={chapter.chapters}
            setChapter={chapter.setChapter}
            chapterCount={chapter.state.chapterCount}
            isChapter={isChapter}
            isChapterError={isChapterError}
          />
        </div>
        <div className="controller__container-left">
          <div className="controller__drop-down">
            <label className="controller__quality-label" htmlFor="quality">
              Quality
            </label>
            {isChapterImage || isChapter ? (
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                className="controller__drop-down-skeleton"
              />
            ) : isChapterError ? (
              <ErrorComp
                height="20px"
                width="90px"
                className={"error-comp--bg-clr"}
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
            <NavButton
              onClick={nav.handlePrevChunk}
              disabled={!nav.hasPrevChunk || isChapter || isChapterError}
              type="top"
            />
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
            <NavButton
              onClick={nav.handleNextChunk}
              disabled={!nav.hasNextChunk || isChapter || isChapterError}
              type="down"
            />
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

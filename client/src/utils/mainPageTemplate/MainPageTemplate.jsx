import "./main-page-template.css";
import PropTypes from "prop-types";

const MainPageTemplate = ({
  children,
  img,
  title,
  description,
  titleClassName,
}) => {
  return (
    <>
      <img
        src={img}
        className="main-page__bg-img"
        alt="pattern"
        aria-hidden="true"
      />
      <article className="main-page">
        <div className="main-page__top-wrapper | container">
          <div className="main-page__intro-container">
            <h2 className={`main-page__title ${titleClassName}`}>{title}</h2>
            <p className="main-page__description">{description}</p>
          </div>
        </div>
        <div className="main-page__content-wrapper">{children}</div>
      </article>
    </>
  );
};

MainPageTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  img: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  titleClassName: PropTypes.string,
};

export default MainPageTemplate;

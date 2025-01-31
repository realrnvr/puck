import "./template.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import GoogleBtn from "../../components/ui/googleBtn/GoogleBtn";

const Template = ({ children, template }) => {
  return (
    <>
      <img src="/pattern-2.svg" className="template__bg-img" alt="" />
      <article className="template | container">
        <div className="template__l-container">
          <div className="template__intro">
            <Link to="/" className="template__heading">
              Welcome to Puck
            </Link>
            <p className="template__brief">
              Start enjoying your favourite manga and anime!
            </p>
            <img className="template__l-container-bg" src="/bg-1.webp" alt="" />
          </div>
        </div>
        <div className="template__r-container">
          <div className="template__content">
            <div className="template__wrapper">
              <div className="template__top-container">
                <h2 className="template__title">
                  {template === "login" ? "Log In" : "Sign Up"}
                </h2>
                <p className="template__description">
                  {template === "login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <Link
                    to={template === "login" ? "/signup" : "/login"}
                    className="template__link template__goto-btn"
                  >
                    {template === "login" ? "Sign Up" : "Log In"}
                  </Link>
                </p>
              </div>
              {children}
              <div className="template__bottom-container">
                <p className="template__description">or</p>
                <GoogleBtn />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

Template.propTypes = {
  children: PropTypes.node.isRequired,
  template: PropTypes.string,
};

export default Template;

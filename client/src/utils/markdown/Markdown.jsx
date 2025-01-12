import "./markdown.css";
import PropTypes from "prop-types";
import { memo } from "react";
import ReactMarkdown from "react-markdown";

const Markdown = ({ content, className = "" }) => {
  return (
    <div className={`markdown ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

Markdown.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
};

export default memo(Markdown);

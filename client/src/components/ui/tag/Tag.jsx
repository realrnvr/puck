import "./tag.css";
import { memo } from "react";
import PropTypes from "prop-types";

const Tag = ({ tag, clr }) => {
  return (
    <p style={{ backgroundColor: clr ? "orange" : "grey" }} className="tag">
      {tag}
    </p>
  );
};

Tag.propTypes = {
  tag: PropTypes.string,
  clr: PropTypes.bool,
};

export default memo(Tag);

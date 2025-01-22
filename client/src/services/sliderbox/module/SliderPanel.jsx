import "./slider-panel.css";
import { useLightboxState } from "yet-another-react-lightbox";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function SliderPanel({ children, SliderPanelProps: { isError } }) {
  const { currentSlide } = useLightboxState();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/manga/${currentSlide?.mangaId}/${currentSlide?.authorId}`);
  };

  return (
    <>
      {children}
      <div className="panel">
        <button className="panel__btn" onClick={handleClick} disabled={isError}>
          View
        </button>
      </div>
    </>
  );
}

SliderPanel.propTypes = {
  children: PropTypes.node.isRequired,
  SliderPanelProps: PropTypes.object,
};

export default SliderPanel;

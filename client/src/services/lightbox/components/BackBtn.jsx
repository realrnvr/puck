import { useNavigate } from "react-router-dom";

const BackBtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <button
      type="button"
      className="controller__back | yarl__button"
      onClick={handleClick}
    >
      <svg
        className="controller__back-svg"
        fill="currentColor"
        viewBox="0 0 512 512"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="square"
          strokeMiterlimit={10}
          strokeWidth={48}
          d="M328 112 184 256l144 144"
        />
      </svg>
    </button>
  );
};

export default BackBtn;

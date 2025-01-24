import ErrorComp from "../../../utils/errorComp/ErrorComp";

const SliderErrorPlaceholder = () => {
  return (
    <div className="slider-sk">
      <div className="slider-sk__top">
        <h2 className="slider-sk__title">
          <ErrorComp height="40px" className={"error-comp--bg-clr"} />
        </h2>
        <div className="slider-sk__btn">
          <ErrorComp height="30px" className={"error-comp--bg-clr"} />
        </div>
      </div>
      <div>
        <p className="slider-sk__description">
          <ErrorComp height="120px" className={"error-comp--bg-clr"} />
        </p>
        <div className="slider-sk__box-container">
          {Array.from({ length: 5 }, (_, idx) => {
            return (
              <div key={idx} className="slider-sk__box">
                <ErrorComp height="50px" className={"error-comp--bg-clr"} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SliderErrorPlaceholder;

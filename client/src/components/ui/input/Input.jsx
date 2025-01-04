import "./input.css";
import PropTypes from "prop-types";
import { useState } from "react";

const Input = ({ register, errors, watch, formData, className }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const { name, label, defaultMsg, toggle, type } = formData;

  function getError() {
    return errors[name];
  }
  const error = getError();

  return (
    <div className="input">
      {label ? (
        <label className="input__label" htmlFor={name}>
          {label}
        </label>
      ) : null}
      <div className="input__wrapper">
        <input
          {...register(name)}
          className={`input__field ${className} ${
            toggle && "input__field--password"
          }`}
          type={toggle ? (showPassword ? "text" : "password") : type}
          id={name}
          style={{
            outline: error?.message && "2px solid #dc2626",
          }}
        />
        {toggle && (
          <button
            className="input__eye-btn"
            onClick={handlePasswordToggle}
            type="button"
          >
            {showPassword ? (
              <svg
                className="input__eye-icon"
                viewBox="0 0 660 512"
                fill="currentColor"
              >
                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zm144 224c0 79.5-64.5 144-144 144s-144-64.5-144-144 64.5-144 144-144 144 64.5 144 144zm-144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.6-8.4-.2 2.8-.4 5.5-.4 8.4 0 53 43 96 96 96s96-43 96-96-43-96-96-96c-2.8 0-5.6.1-8.4.4 5.3 9.3 8.4 20.1 8.4 31.6z" />
              </svg>
            ) : (
              <svg
                className="input__eye-icon"
                viewBox="0 0 700 512"
                fill="currentColor"
              >
                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2s-6.3 25.5 4.1 33.7l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-105.2-82.4c39.6-40.6 66.4-86.1 79.9-118.4 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm184.3 144.4c25.5-23.3 59.6-37.5 96.9-37.5 79.5 0 144 64.5 144 144 0 24.9-6.3 48.3-17.4 68.7L408 294.5c5.2-11.8 8-24.8 8-38.5 0-53-43-96-96-96-2.8 0-5.6.1-8.4.4 5.3 9.3 8.4 20.1 8.4 31.6 0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zm223.1 298L373 389.9c-16.4 6.5-34.3 10.1-53 10.1-79.5 0-144-64.5-144-144 0-6.9.5-13.6 1.4-20.2l-94.3-74.3c-22.8 29.7-39.1 59.3-48.6 82.2-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47 43.8 111.7 80.6 192.5 80.6 47.8 0 89.9-12.9 126.2-32.5z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {defaultMsg && (
        <div className="input__valid">
          {error ? (
            <svg
              className="input__valid-icon"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#dc2626"
                d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z"
                fillRule="evenodd"
              />
            </svg>
          ) : watch(name) ? (
            <svg
              className="input__valid-icon"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 335.765 335.765"
            >
              <g>
                <polygon
                  fill="#16a34a"
                  points="311.757,41.803 107.573,245.96 23.986,162.364 0,186.393 107.573,293.962 335.765,65.795   "
                />
              </g>
            </svg>
          ) : (
            <svg
              className="input__valid-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 9.5C13.3807 9.5 14.5 10.6193 14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5Z" />
            </svg>
          )}
          <span
            style={{
              color: error ? "#dc2626" : watch(name) && "#16a34a",
            }}
            className="input__valid-text"
          >
            {error ? error.message : defaultMsg}
          </span>
        </div>
      )}
    </div>
  );
};

Input.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default Input;

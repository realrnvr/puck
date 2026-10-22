import "./navigation-toast.css";
import toast from "react-hot-toast";

interface NavigationToastProps {
  email?: string;
  navigate: (to: string) => void;
  to: string;
  toastId: string;
  path: string;
  message: string;
  btnText: string;
}

const NavigationToast = ({
  email,
  navigate,
  to,
  toastId,
  path,
  message,
  btnText,
}: NavigationToastProps) => {
  return (
    <div className="v-toast__toaster">
      <p className="v-toast__t-description">{message}</p>
      <div className="v-toast__t-container">
        <button
          type="button"
          className="v-toast__t-verification-btn"
          onClick={() => {
            localStorage.setItem(path, email ?? "");
            navigate(to);
            toast.dismiss(toastId);
          }}
        >
          {btnText}
        </button>
        <button
          type="button"
          className="v-toast__t-close-btn"
          aria-label="Dismiss notification"
          onClick={() => toast.dismiss(toastId)}
        >
          <svg
            className="v-toast__t-close-btn-svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NavigationToast;

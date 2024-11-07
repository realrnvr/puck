import "./noti.css";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Noti = () => {
  const navigate = useNavigate();

  const notifyUnverifiedUser = () => {
    toast.custom(
      (t) => (
        <div className="custom-toast">
          Account exists but is not verified.{" "}
          <button
            onClick={() => {
              toast.dismiss(t.id); // Dismiss the toast
              navigate("/verificationPage"); // Navigate to verification
            }}
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Go to Verification
          </button>
        </div>
      ),
      {
        id: "unverifiedUserToast", // Unique ID for uniqueness
        duration: 5000,
      }
    );
  };

  return (
    <>
      <button onClick={notifyUnverifiedUser}>Trigger Verification Toast</button>
      {/* Custom Toaster only for verification messages */}
      <Toaster
        position="bottom-left" // Custom position to avoid overlap
        toastOptions={{
          duration: 5000,
          style: {
            backgroundColor: "#ffffe3",
            color: "#333",
            fontSize: "0.9rem",
          },
        }}
      />
    </>
  );
};

export default Noti;

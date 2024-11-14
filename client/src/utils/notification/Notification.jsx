import { Toaster } from "react-hot-toast";

const Notification = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          color: "#191815",
          fontSize: "1rem",
        },
        iconTheme: {
          primary: "#191815",
          secondary: "#ffffe3",
        },
      }}
    />
  );
};

export default Notification;

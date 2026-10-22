import "./redirect.css";
import { useRedirect } from "../../../hooks/useRedirect";
import Loader from "../../../components/ui/loader/Loader";

const Redirect = () => {
  useRedirect();

  return (
    <div className="redirect">
      <Loader />
    </div>
  );
};

export default Redirect;
